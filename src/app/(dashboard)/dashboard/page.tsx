'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Calendar, MessageCircle, Star, TrendingUp,
  ArrowUpRight, ArrowDownRight, Activity, Zap
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { createClient } from '@/lib/supabase/client'

// ─── Dummy Data ────────────────────────────────────────────────────────────
const leadData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
  leads: Math.floor(Math.random() * 15 + 3),
  randevular: Math.floor(Math.random() * 8 + 1),
  donusumler: Math.floor(Math.random() * 5 + 1),
}))

const reviewData = Array.from({ length: 7 }, (_, i) => ({
  gun: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i],
  yorumlar: Math.floor(Math.random() * 5 + 1),
}))

// ─── KPI Card ──────────────────────────────────────────────────────────────
function KPICard({
  title, value, change, icon: Icon, color, index
}: {
  title: string
  value: string
  change: number
  icon: any
  color: string
  index: number
}) {
  const isPositive = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{title}</p>
    </motion.div>
  )
}

// ─── Live Feed Item ────────────────────────────────────────────────────────
function LiveFeedItem({ name, action, time, avatar }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{action}</p>
      </div>
      <span className="text-xs text-slate-400 flex-shrink-0">{time}</span>
    </motion.div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [clinicName, setClinicName] = useState('Güler Diş Kliniği')

  const kpis = [
    { title: 'Günlük Lead', value: '24', change: 12, icon: Users, color: 'bg-blue-500' },
    { title: 'Randevu', value: '8', change: 5, icon: Calendar, color: 'bg-indigo-500' },
    { title: 'WhatsApp Mesajı', value: '156', change: 23, icon: MessageCircle, color: 'bg-emerald-500' },
    { title: 'Google Yorumu', value: '+3', change: -8, icon: Star, color: 'bg-amber-500' },
    { title: 'Dönüşüm Oranı', value: '%34', change: 7, icon: TrendingUp, color: 'bg-violet-500' },
  ]

  const liveFeed = [
    { name: 'Ayşe Kaya', action: 'Yeni WhatsApp mesajı gönderdi', time: '2dk', avatar: 'AK' },
    { name: 'Mehmet Demir', action: 'Randevu aldı - Porselen Kron', time: '8dk', avatar: 'MD' },
    { name: 'Fatma Şahin', action: 'Google yorumu bıraktı ⭐⭐⭐⭐⭐', time: '15dk', avatar: 'FŞ' },
    { name: 'Ali Çelik', action: 'İmplant fiyatı sordu', time: '32dk', avatar: 'AÇ' },
    { name: 'Zeynep Arslan', action: 'Randevusunu iptal etti', time: '1sa', avatar: 'ZA' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {clinicName} · Bugün {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">AI Asistanı Aktif</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.title} {...kpi} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lead Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">Lead & Randevu Trendi</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Son 30 gün</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>Lead</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"/>Randevu</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={leadData}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="leads" name="Lead" stroke="#3B82F6" strokeWidth={2} fill="url(#leadGrad)" />
              <Area type="monotone" dataKey="randevular" name="Randevu" stroke="#6366F1" strokeWidth={2} fill="url(#appGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Review Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">Yorum Artışı</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Bu hafta</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reviewData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="gun" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="yorumlar" name="Yorum" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">Canlı Aktivite</h2>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600">
              <Activity size={12} />
              Canlı
            </span>
          </div>
          <div>
            {liveFeed.map((item, i) => (
              <LiveFeedItem key={i} {...item} />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Yeni Hasta Ekle', icon: Users, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', href: '/patients/new' },
              { label: 'Randevu Oluştur', icon: Calendar, color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400', href: '/appointments/new' },
              { label: 'WhatsApp Gönder', icon: MessageCircle, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', href: '/crm' },
              { label: 'Yorum İste', icon: Star, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', href: '/reviews' },
            ].map((action) => (
              <button
                key={action.label}
                className={`flex items-center gap-3 p-4 rounded-xl ${action.color} transition-all hover:scale-[1.02] text-left`}
              >
                <action.icon size={18} />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>

          {/* AI Status */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">AI Asistanı</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Bugün <strong>47 mesajı</strong> otomatik yanıtladı. Dönüşüm oranı: <strong>%72</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
