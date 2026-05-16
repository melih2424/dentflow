'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Calendar, MoreHorizontal, Plus, Search } from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────
type Stage = {
  id: string
  label: string
  color: string
  bgColor: string
  count: number
}

type Lead = {
  id: string
  name: string
  phone: string
  stage: string
  service: string
  source: string
  time: string
  avatar: string
  value?: string
}

// ─── Data ──────────────────────────────────────────────────────────────────
const STAGES: Stage[] = [
  { id: 'new_lead', label: 'Yeni Lead', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/30', count: 8 },
  { id: 'price_given', label: 'Fiyat Aldı', color: 'text-violet-600', bgColor: 'bg-violet-50 dark:bg-violet-900/30', count: 5 },
  { id: 'appointment_pending', label: 'Randevu Bekliyor', color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/30', count: 4 },
  { id: 'appointment_booked', label: 'Randevu Aldı', color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/30', count: 6 },
  { id: 'treatment_started', label: 'Tedavi Başladı', color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/30', count: 3 },
  { id: 'review_done', label: 'Yorum Yaptı', color: 'text-rose-600', bgColor: 'bg-rose-50 dark:bg-rose-900/30', count: 2 },
]

const DUMMY_LEADS: Lead[] = [
  { id: '1', name: 'Ayşe Kaya', phone: '+90 532 111 2233', stage: 'new_lead', service: 'İmplant', source: 'WhatsApp', time: '5dk', avatar: 'AK', value: '₺15.000' },
  { id: '2', name: 'Mehmet Demir', phone: '+90 533 222 3344', stage: 'new_lead', service: 'Porselen Kron', source: 'Instagram', time: '12dk', avatar: 'MD', value: '₺8.500' },
  { id: '3', name: 'Fatma Şahin', phone: '+90 534 333 4455', stage: 'new_lead', service: 'Diş Beyazlatma', source: 'Google', time: '1sa', avatar: 'FŞ', value: '₺3.500' },
  { id: '4', name: 'Ali Çelik', phone: '+90 535 444 5566', stage: 'price_given', service: 'İmplant', source: 'Facebook', time: '2sa', avatar: 'AÇ', value: '₺22.000' },
  { id: '5', name: 'Zeynep Arslan', phone: '+90 536 555 6677', stage: 'price_given', service: 'Gömülü Diş', source: 'WhatsApp', time: '3sa', avatar: 'ZA', value: '₺5.000' },
  { id: '6', name: 'Burak Yıldız', phone: '+90 537 666 7788', stage: 'appointment_pending', service: 'Kanal Tedavisi', source: 'Instagram', time: '1gün', avatar: 'BY', value: '₺4.500' },
  { id: '7', name: 'Selin Koç', phone: '+90 538 777 8899', stage: 'appointment_booked', service: 'Zirkonyum', source: 'Google', time: '2gün', avatar: 'SK', value: '₺18.000' },
  { id: '8', name: 'Emre Öztürk', phone: '+90 539 888 9900', stage: 'treatment_started', service: 'İmplant', source: 'Organik', time: '1hft', avatar: 'EÖ', value: '₺20.000' },
  { id: '9', name: 'Nazlı Yılmaz', phone: '+90 530 999 0011', stage: 'review_done', service: 'Diş Kaplama', source: 'WhatsApp', time: '2hft', avatar: 'NY', value: '₺12.000' },
]

const SOURCE_COLORS: Record<string, string> = {
  WhatsApp: 'bg-emerald-100 text-emerald-700',
  Instagram: 'bg-pink-100 text-pink-700',
  Facebook: 'bg-blue-100 text-blue-700',
  Google: 'bg-red-100 text-red-700',
  Organik: 'bg-slate-100 text-slate-600',
}

// ─── Lead Card ─────────────────────────────────────────────────────────────
function LeadCard({ lead, onMove }: { lead: Lead; onMove: (id: string, direction: 'forward' | 'back') => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {lead.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">{lead.name}</p>
            <p className="text-xs text-slate-400">{lead.time}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={14} className="text-slate-400" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
          {lead.service}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_COLORS[lead.source] || 'bg-slate-100 text-slate-600'}`}>
          {lead.source}
        </span>
      </div>

      {lead.value && (
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">{lead.value}</p>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-600">
        <button className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors">
          <MessageCircle size={12} />
          Mesaj
        </button>
        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors ml-auto">
          <Calendar size={12} />
          Randevu
        </button>
      </div>
    </motion.div>
  )
}

// ─── CRM Page ──────────────────────────────────────────────────────────────
export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(DUMMY_LEADS)
  const [search, setSearch] = useState('')
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<string | null>(null)

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.service.toLowerCase().includes(search.toLowerCase())
  )

  const handleDrop = (stageId: string) => {
    if (!draggedId) return
    setLeads(prev => prev.map(l => l.id === draggedId ? { ...l, stage: stageId } : l))
    setDraggedId(null)
    setOverStage(null)
  }

  const totalValue = leads.reduce((sum, l) => {
    const n = parseInt((l.value || '₺0').replace(/[^0-9]/g, ''))
    return sum + n
  }, 0)

  return (
    <div className="p-6 h-screen flex flex-col max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">CRM Pipeline</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {leads.length} aktif lead · Toplam potansiyel:{' '}
            <span className="font-semibold text-emerald-600">₺{totalValue.toLocaleString('tr-TR')}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Hasta ara..."
              className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
            <Plus size={14} />
            Yeni Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
        {STAGES.map(stage => {
          const stageLeads = filtered.filter(l => l.stage === stage.id)
          const isOver = overStage === stage.id

          return (
            <div
              key={stage.id}
              className={`flex-shrink-0 w-64 flex flex-col rounded-2xl transition-colors ${
                isOver ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-slate-50 dark:bg-slate-800/50'
              }`}
              onDragOver={e => { e.preventDefault(); setOverStage(stage.id) }}
              onDragLeave={() => setOverStage(null)}
              onDrop={() => handleDrop(stage.id)}
            >
              {/* Stage Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stage.bgColor} ${stage.color}`}>
                    {stage.label}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 w-5 h-5 rounded-full flex items-center justify-center">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
                <AnimatePresence mode="popLayout">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => setDraggedId(lead.id)}
                      onDragEnd={() => { setDraggedId(null); setOverStage(null) }}
                    >
                      <LeadCard lead={lead} onMove={() => {}} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
