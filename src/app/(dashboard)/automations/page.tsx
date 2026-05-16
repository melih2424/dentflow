'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Clock, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

type Automation = {
  id: string
  name: string
  trigger: string
  triggerLabel: string
  delay: string
  message: string
  active: boolean
  stats: { sent: number; converted: number }
}

const DUMMY_AUTOMATIONS: Automation[] = [
  {
    id: '1',
    name: 'Randevu Hatırlatması',
    trigger: 'appointment_reminder',
    triggerLabel: 'Randevudan 3 saat önce',
    delay: '3 saat önce',
    message: 'Merhaba {hasta_adi}! 📅 Bugün saat {randevu_saati} için randevunuz bulunmaktadır. Kliniğimizde sizi bekliyoruz! Değişiklik için: {klinik_telefon}',
    active: true,
    stats: { sent: 234, converted: 198 },
  },
  {
    id: '2',
    name: 'Tedavi Sonrası Yorum İsteği',
    trigger: 'after_appointment',
    triggerLabel: 'Randevudan 24 saat sonra',
    delay: '24 saat',
    message: 'Merhaba {hasta_adi}! 😊 Tedavinizin nasıl geçtiğini merak ediyoruz. Kliniğimize 5 yıldız vermek ister misiniz? ⭐ {google_review_link}',
    active: true,
    stats: { sent: 189, converted: 67 },
  },
  {
    id: '3',
    name: 'Gelen Gelme Takibi',
    trigger: 'no_show',
    triggerLabel: 'Randevu kaçırıldığında',
    delay: '2 saat sonra',
    message: 'Merhaba {hasta_adi}, bugün randevunuza gelemediğinizi fark ettik. 💙 Yeni bir randevu almak ister misiniz? Hemen mesaj atabilirsiniz.',
    active: true,
    stats: { sent: 45, converted: 23 },
  },
  {
    id: '4',
    name: 'Yeni Lead Karşılama',
    trigger: 'new_lead',
    triggerLabel: 'Yeni mesaj geldiğinde - 2. mesaj',
    delay: '10 dakika',
    message: 'Merhaba {hasta_adi}! 🦷 Güler Diş Kliniği olarak size yardımcı olmaktan mutluluk duyarız. Ücretsiz muayene için bugün randevu alabilirsiniz!',
    active: false,
    stats: { sent: 12, converted: 4 },
  },
]

const TRIGGER_LABELS: Record<string, { color: string; bg: string }> = {
  appointment_reminder: { color: 'text-blue-700', bg: 'bg-blue-50' },
  after_appointment: { color: 'text-amber-700', bg: 'bg-amber-50' },
  no_show: { color: 'text-red-700', bg: 'bg-red-50' },
  new_lead: { color: 'text-emerald-700', bg: 'bg-emerald-50' },
  review_request: { color: 'text-violet-700', bg: 'bg-violet-50' },
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(DUMMY_AUTOMATIONS)

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(a => a.id === id ? { ...a, active: !a.active } : a)
    )
    const auto = automations.find(a => a.id === id)
    toast.success(`${auto?.name} ${auto?.active ? 'durduruldu' : 'aktifleştirildi'}`)
  }

  const totalSent = automations.reduce((s, a) => s + a.stats.sent, 0)
  const totalConverted = automations.reduce((s, a) => s + a.stats.converted, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Otomasyonlar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Otomatik WhatsApp mesaj kuralları</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          Yeni Otomasyon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Aktif Otomasyon', value: automations.filter(a => a.active).length, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Toplam Gönderim', value: totalSent, icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Dönüşüm', value: `%${Math.round((totalConverted / totalSent) * 100)}`, icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className={`w-9 h-9 ${stat.bg} dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={17} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Automation Cards */}
      <div className="space-y-4">
        {automations.map((auto, i) => {
          const tagStyle = TRIGGER_LABELS[auto.trigger] || { color: 'text-slate-600', bg: 'bg-slate-100' }
          return (
            <motion.div
              key={auto.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border shadow-sm transition-all ${
                auto.active
                  ? 'border-slate-100 dark:border-slate-700'
                  : 'border-slate-100 dark:border-slate-700 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white">{auto.name}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagStyle.bg} ${tagStyle.color} dark:bg-opacity-20`}>
                      {auto.triggerLabel}
                    </span>
                    {auto.active && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Aktif
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 mb-4 leading-relaxed font-mono">
                    {auto.message}
                  </p>

                  <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={12} />
                      {auto.stats.sent} gönderim
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <Zap size={12} />
                      {auto.stats.converted} dönüşüm
                    </span>
                    <span>
                      %{Math.round((auto.stats.converted / auto.stats.sent) * 100)} oran
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Edit2 size={15} className="text-slate-500" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={15} className="text-red-500" />
                  </button>
                  <button
                    onClick={() => toggleAutomation(auto.id)}
                    className="p-1 transition-colors"
                  >
                    {auto.active
                      ? <ToggleRight size={28} className="text-blue-600" />
                      : <ToggleLeft size={28} className="text-slate-400" />
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Variables Help */}
      <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Kullanılabilir Değişkenler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['{hasta_adi}', '{randevu_saati}', '{randevu_tarihi}', '{klinik_telefon}', '{klinik_adi}', '{google_review_link}', '{doktor_adi}', '{tedavi_adi}'].map(v => (
            <code key={v} className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-blue-600 font-mono">
              {v}
            </code>
          ))}
        </div>
      </div>
    </div>
  )
}
