'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Save, Play, RefreshCw, MessageCircle, Settings2 } from 'lucide-react'
import toast from 'react-hot-toast'

const DEFAULT_PROMPT = `Sen Güler Diş Kliniği'nin yapay zeka asistanısın.

KURALLAR:
- Her zaman Türkçe konuş, samimi ve profesyonel ol
- Kesin fiyat verme, "doktorumuz muayene sonrası bilgilendirir" de  
- Her konuşmada ücretsiz ilk muayene teklifini vurgula
- Randevu almaya yönlendir, randevu için isim ve telefon iste
- Acil durumlarda: "Hemen kliniğimizi arayın: 0212 555 0100"
- Mesajları kısa tut (3-4 cümle max)
- Emoji kullan ama abartma 🦷😊

KLİNİK BİLGİLERİ:
- Adres: Bağcılar, İstanbul
- Telefon: 0212 555 0100
- Çalışma saatleri: Hafta içi 09:00-19:00, Cumartesi 10:00-17:00
- Hizmetler: İmplant, Zirkonyum, Porselen, Kanal Tedavisi, Ortodonti, Beyazlatma`

const TEST_MESSAGES = [
  'Merhaba, implant fiyatları ne kadar?',
  'Porselen diş ne zaman randevu alabilirim?',
  'Acil durum var, dişim çok ağrıyor',
]

export default function AISettingsPage() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
  const [testMessage, setTestMessage] = useState(TEST_MESSAGES[0])
  const [testResponse, setTestResponse] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [model, setModel] = useState('gpt-4o-mini')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(300)

  const handleTest = async () => {
    setIsTesting(true)
    setTestResponse('')
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, message: testMessage, model, temperature, maxTokens }),
      })
      const data = await res.json()
      setTestResponse(data.response || 'Yanıt alınamadı')
    } catch {
      setTestResponse('Test sırasında hata oluştu')
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // In production: save to Supabase
    await new Promise(r => setTimeout(r, 800))
    setIsSaving(false)
    toast.success('AI ayarları kaydedildi!')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">AI Asistan Ayarları</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">WhatsApp AI asistanının davranışını özelleştirin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prompt Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bot size={18} className="text-blue-600" />
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">Sistem Promptu</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            AI asistanının nasıl davranacağını belirleyen talimatlar. Klinik bilgilerinizi ve kurallarınızı buraya yazın.
          </p>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={18}
            className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-400">{prompt.length} karakter</span>
            <button
              onClick={() => setPrompt(DEFAULT_PROMPT)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Varsayılana sıfırla
            </button>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Model Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings2 size={18} className="text-slate-500" />
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">Model Ayarları</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Model
                </label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Önerilen - Hızlı & Ekonomik)</option>
                  <option value="gpt-4o">GPT-4o (En İyi Kalite)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (En Ekonomik)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Sıcaklık (Yaratıcılık): {temperature}
                </label>
                <input
                  type="range" min="0" max="1" step="0.1"
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Tutarlı</span><span>Yaratıcı</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Maks. Token: {maxTokens}
                </label>
                <input
                  type="range" min="100" max="800" step="50"
                  value={maxTokens}
                  onChange={e => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Kısa</span><span>Uzun</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Test Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={18} className="text-emerald-500" />
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">AI Test Paneli</h2>
            </div>

            <div className="space-y-2 mb-3">
              {TEST_MESSAGES.map(msg => (
                <button
                  key={msg}
                  onClick={() => setTestMessage(msg)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl border transition-colors ${
                    testMessage === msg
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {msg}
                </button>
              ))}
            </div>

            <textarea
              value={testMessage}
              onChange={e => setTestMessage(e.target.value)}
              rows={2}
              placeholder="Test mesajı yazın..."
              className="w-full text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
            />

            <button
              onClick={handleTest}
              disabled={isTesting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isTesting ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
              {isTesting ? 'Test ediliyor...' : 'Test Et'}
            </button>

            {testResponse && (
              <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">AI Yanıtı:</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{testResponse}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
