import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateAIResponse } from '@/lib/openai/chat'
import { sendWhatsAppMessage } from '@/lib/whatsapp/send'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!

// ─── GET: Webhook Verification (Meta requires this) ───────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verified ✓')
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// ─── POST: Incoming Messages ───────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Meta sends test pings with 'statuses' - ignore those
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value?.messages?.length) {
      return NextResponse.json({ status: 'ok' })
    }

    const message = value.messages[0]
    const contact = value.contacts?.[0]

    if (message.type !== 'text') {
      // Handle non-text messages gracefully
      return NextResponse.json({ status: 'ok' })
    }

    const incomingPhone = message.from        // e.g. "905321234567"
    const incomingText = message.text.body
    const waMessageId = message.id
    const recipientPhone = value.metadata.display_phone_number

    const supabase = createClient()

    // 1. Find which clinic this WhatsApp number belongs to
    const { data: clinic } = await supabase
      .from('clinics')
      .select('*')
      .eq('whatsapp_number', `+${recipientPhone}`)
      .single()

    if (!clinic) {
      console.error('[Webhook] No clinic found for number:', recipientPhone)
      return NextResponse.json({ status: 'ok' })
    }

    // 2. Find or create patient
    let { data: patient } = await supabase
      .from('patients')
      .select('*')
      .eq('phone', `+${incomingPhone}`)
      .eq('clinic_id', clinic.id)
      .single()

    if (!patient) {
      const { data: newPatient } = await supabase
        .from('patients')
        .insert({
          clinic_id: clinic.id,
          full_name: contact?.profile?.name || `Hasta +${incomingPhone}`,
          phone: `+${incomingPhone}`,
          source: 'whatsapp',
          status: 'new_lead',
        })
        .select()
        .single()
      patient = newPatient
    }

    if (!patient) {
      return NextResponse.json({ error: 'Patient creation failed' }, { status: 500 })
    }

    // Update last contact time
    await supabase
      .from('patients')
      .update({ last_contact: new Date().toISOString() })
      .eq('id', patient.id)

    // 3. Save incoming message
    await supabase.from('conversations').insert({
      patient_id: patient.id,
      clinic_id: clinic.id,
      role: 'user',
      message: incomingText,
      wa_message_id: waMessageId,
    })

    // 4. Load conversation history (last 20 messages)
    const { data: history } = await supabase
      .from('conversations')
      .select('role, message')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: true })
      .limit(20)

    // 5. Generate AI response
    const aiReply = await generateAIResponse({
      clinicPrompt: clinic.ai_prompt,
      clinicName: clinic.name,
      patientName: patient.full_name,
      history: history || [],
      userMessage: incomingText,
    })

    // 6. Save AI response
    await supabase.from('conversations').insert({
      patient_id: patient.id,
      clinic_id: clinic.id,
      role: 'assistant',
      message: aiReply,
    })

    // 7. Send WhatsApp reply
    await sendWhatsAppMessage({
      to: incomingPhone,
      message: aiReply,
      phoneNumberId: value.metadata.phone_number_id,
    })

    // 8. Check if automation should trigger
    await triggerAutomations(supabase, clinic.id, patient.id, 'new_lead')

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('[WhatsApp Webhook Error]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// ─── Automation Trigger ───────────────────────────────────────────────────
async function triggerAutomations(
  supabase: ReturnType<typeof createClient>,
  clinicId: string,
  patientId: string,
  triggerType: string
) {
  const { data: automations } = await supabase
    .from('automations')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('trigger_type', triggerType)
    .eq('is_active', true)

  if (!automations?.length) return

  // In production: queue these with a job scheduler (Inngest, Trigger.dev, etc.)
  // For now, log them
  console.log(`[Automations] ${automations.length} automation(s) queued for patient ${patientId}`)
}
