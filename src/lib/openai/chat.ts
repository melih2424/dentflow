import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

interface ChatMessage {
  role: 'user' | 'assistant'
  message: string
}

interface GenerateAIResponseParams {
  clinicPrompt: string
  clinicName: string
  patientName: string
  history: ChatMessage[]
  userMessage: string
}

export async function generateAIResponse({
  clinicPrompt,
  clinicName,
  patientName,
  history,
  userMessage,
}: GenerateAIResponseParams): Promise<string> {
  const systemPrompt = `${clinicPrompt}

Klinik Adı: ${clinicName}
Hasta Adı: ${patientName}

Önemli kurallar:
- Türkçe konuş, samimi ve sıcak ol
- Kesin fiyat verme, "muayene sonrası doktorumuz bilgi verir" de
- Her mesajda randevu almaya teşvik et
- Ücretsiz ilk muayene teklifini vurgula
- Mesajları kısa tut (max 3-4 cümle)
- Emoji kullan ama abartma
- Asla rakip klinikleri kötüleme
- Acil durumları hemen yönlendir: "Lütfen hemen kliniğimizi arayın"
`

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    // Inject conversation history
    ...history.slice(-15).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.message,
    })),
    { role: 'user', content: userMessage },
  ]

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || fallbackMessage()
  } catch (error) {
    console.error('[OpenAI Error]', error)
    return fallbackMessage()
  }
}

function fallbackMessage(): string {
  return 'Merhaba! 😊 Kliniğimize ilginiz için teşekkür ederiz. Sizi en kısa sürede bilgilendireceğiz. Randevu almak ister misiniz?'
}

// ─── Generate review request message ─────────────────────────────────────
export async function generateReviewRequest(
  clinicName: string,
  patientName: string,
  reviewLink: string
): Promise<string> {
  const prompt = `${patientName} isimli hastamıza tedavi sonrası Google yorumu isteyen kısa, samimi bir WhatsApp mesajı yaz. Klinik adı: ${clinicName}. Google link: ${reviewLink}. Max 3 cümle, emoji kullan.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
  })

  return response.choices[0]?.message?.content || `Değerli ${patientName}, tedavinizin nasıl geçtiğini merak ediyoruz. Deneyiminizi paylaşır mısınız? 🦷 ${reviewLink}`
}
