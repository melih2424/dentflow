import axios from 'axios'

const WA_API_VERSION = 'v20.0'
const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!

interface SendMessageParams {
  to: string          // phone number without +
  message: string
  phoneNumberId: string
}

interface SendTemplateParams {
  to: string
  phoneNumberId: string
  templateName: string
  languageCode?: string
  components?: object[]
}

// ─── Send Text Message ─────────────────────────────────────────────────────
export async function sendWhatsAppMessage({
  to,
  message,
  phoneNumberId,
}: SendMessageParams): Promise<{ success: boolean; messageId?: string }> {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/${WA_API_VERSION}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: message, preview_url: false },
      },
      {
        headers: {
          Authorization: `Bearer ${WA_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const messageId = response.data.messages?.[0]?.id
    return { success: true, messageId }
  } catch (error: any) {
    console.error('[WhatsApp Send Error]', error.response?.data || error.message)
    return { success: false }
  }
}

// ─── Send Review Request with Button ─────────────────────────────────────
export async function sendReviewRequestMessage({
  to,
  phoneNumberId,
  patientName,
  reviewLink,
  clinicName,
}: {
  to: string
  phoneNumberId: string
  patientName: string
  reviewLink: string
  clinicName: string
}) {
  const message = `Merhaba ${patientName}! 😊\n\n${clinicName} olarak tedavinizin başarıyla tamamlandığını tebrik ederiz! 🦷\n\nDeneyiminizi diğer hastalarımızla paylaşır mısınız? Yorumunuz bizim için çok değerli:\n\n${reviewLink}\n\nSağlıklı günler dileriz! 💙`

  return sendWhatsAppMessage({ to, message, phoneNumberId })
}

// ─── Send Appointment Reminder ─────────────────────────────────────────────
export async function sendAppointmentReminder({
  to,
  phoneNumberId,
  patientName,
  appointmentDate,
  clinicName,
  clinicPhone,
}: {
  to: string
  phoneNumberId: string
  patientName: string
  appointmentDate: string
  clinicName: string
  clinicPhone: string
}) {
  const message = `Merhaba ${patientName}! 📅\n\n${clinicName} olarak randevunuzu hatırlatmak istedik.\n\n⏰ ${appointmentDate}\n\nDeğişiklik için: ${clinicPhone}\n\nSizi bekliyoruz! 😊`

  return sendWhatsAppMessage({ to, message, phoneNumberId })
}

// ─── Get Phone Number ID for a clinic ────────────────────────────────────
export async function getPhoneNumberId(whatsappNumber: string): Promise<string | null> {
  // In production, store phoneNumberId in the clinics table
  // This is a helper for lookups
  return process.env.WHATSAPP_PHONE_NUMBER_ID || null
}
