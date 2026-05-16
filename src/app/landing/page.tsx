'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Bot, Calendar, Star, TrendingUp, Shield, Zap,
  CheckCircle, MessageCircle, ArrowRight, Phone, BarChart2,
  ChevronDown, Users, Clock
} from 'lucide-react'

// ─── Feature Card ──────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, color, index }: any) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group"
    >
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────────
function PricingCard({ plan, price, features, popular, cta }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl p-8 ${
        popular
          ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-200'
          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-white'
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
          EN POPÜLER
        </div>
      )}
      <p className={`text-sm font-semibold mb-1 ${popular ? 'text-blue-200' : 'text-blue-600'}`}>{plan}</p>
      <div className="flex items-end gap-1 mb-6">
        <span className="text-4xl font-black">{price}</span>
        <span className={`text-sm mb-1 ${popular ? 'text-blue-200' : 'text-slate-500'}`}>/ay</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <CheckCircle size={15} className={popular ? 'text-blue-300' : 'text-emerald-500'} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/register"
        className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
          popular
            ? 'bg-white text-blue-700 hover:bg-blue-50'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {cta}
      </Link>
    </motion.div>
  )
}

// ─── Landing Page ──────────────────────────────────────────────────────────
export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const features = [
    { icon: Bot, title: 'AI WhatsApp Asistanı', description: '7/24 otomatik yanıt. Hastalarınız gece mesaj atsa bile anında profesyonel cevap alır.', color: 'bg-blue-600' },
    { icon: Calendar, title: 'Akıllı Randevu Sistemi', description: 'AI randevu kapatır, Google Takvim ile senkronize eder, hatırlatma mesajları gönderir.', color: 'bg-indigo-600' },
    { icon: Star, title: 'Google Yorum Otomasyonu', description: 'Tedavi sonrası otomatik yorum isteği. Kliniğinizin puanı her gün artar.', color: 'bg-amber-500' },
    { icon: TrendingUp, title: 'CRM & Lead Takibi', description: 'Kanban pipeline ile her hastanın satış yolculuğunu takip edin. Hiçbir lead kaçmasın.', color: 'bg-violet-600' },
    { icon: BarChart2, title: 'Reklam Dönüşüm Paneli', description: 'Instagram, Facebook, Google Ads hangi kaynaktan kaç hasta geldi, anlık görün.', color: 'bg-emerald-600' },
    { icon: Shield, title: 'KVKK Uyumlu', description: 'Türkiye veri koruma mevzuatına tam uyumlu. Hasta verileriniz güvende.', color: 'bg-rose-600' },
  ]

  const faqs = [
    { q: 'WhatsApp entegrasyonu nasıl çalışır?', a: 'Meta Business API üzerinden resmi entegrasyon kuruyoruz. Kliniğinizin WhatsApp numarasına gelen tüm mesajlar AI asistanı tarafından otomatik yanıtlanır.' },
    { q: 'AI asistanı yanlış bilgi verir mi?', a: 'AI sadece sizin belirlediğiniz bilgileri paylaşır. Fiyat konusunda kesin bilgi vermez, randevuya yönlendirir. Tüm konuşmaları panelden takip edebilirsiniz.' },
    { q: 'Kurulum ne kadar sürer?', a: 'Ortalama 48 saat. WhatsApp onayı Meta tarafından verildikten sonra sistemi aktif ediyoruz. Size adım adım rehberlik yapıyoruz.' },
    { q: 'Mevcut hastalarımı sisteme aktarabilir miyim?', a: 'Evet, Excel veya CSV dosyasıyla tüm hasta veritabanınızı aktarabilirsiniz.' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-black text-slate-800 dark:text-white">DentFlow <span className="text-blue-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Özellikler', 'Fiyatlar', 'SSS', 'Blog'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Giriş Yap</Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-medium mb-8"
          >
            <Zap size={14} />
            Türkiye'nin İlk Diş Kliniği AI Platformu
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6"
          >
            Kliniğiniz{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Gece Hasta
            </span>
            {' '}Kaybediyor Olabilir
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            WhatsApp AI asistanı ile <strong>7/24 hasta dönüşümü</strong> sağlayın. Randevuyu AI kapatsın, Google yorumunu otomatik artırın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200"
            >
              <MessageCircle size={18} />
              Ücretsiz Demo Al
              <ArrowRight size={16} />
            </Link>
            <a href="#ozellikler" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-sm font-medium">
              Nasıl çalışır? <ChevronDown size={16} />
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800"
          >
            {[
              { value: '150+', label: 'Aktif Klinik' },
              { value: '₺2.4M', label: 'Aylık Dönüşüm' },
              { value: '%340', label: 'Lead Artışı' },
              { value: '4.9★', label: 'Müşteri Puanı' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="ozellikler" className="py-24 bg-slate-50 dark:bg-slate-800/50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Her Şey Tek Platformda</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              DoktorTakvimi + HubSpot + WhatsApp AI + Mini CRM. Hepsini tek yerden yönetin.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="fiyatlar" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Şeffaf Fiyatlandırma</h2>
            <p className="text-slate-500 dark:text-slate-400">14 gün ücretsiz deneyin. Kredi kartı gerekmez.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              plan="Basic"
              price="₺1.490"
              cta="Hemen Başla"
              features={['WhatsApp AI Asistanı', 'Aylık 500 mesaj', 'Temel CRM', 'Email destek']}
            />
            <PricingCard
              plan="Pro"
              price="₺2.990"
              popular
              cta="En Popüler"
              features={['Sınırsız WhatsApp mesajı', 'Randevu otomasyonu', 'Google Yorum sistemi', 'Reklam takibi', 'Öncelikli destek']}
            />
            <PricingCard
              plan="Premium"
              price="₺5.490"
              cta="Satış Ekibi"
              features={['Sınırsız her şey', 'Çoklu klinik', 'Özel AI eğitimi', 'API erişimi', 'Dedicated manager']}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="sss" className="py-24 bg-slate-50 dark:bg-slate-800/50 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 text-center">Sık Sorulan Sorular</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-slate-800 dark:text-white text-sm">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform flex-shrink-0 ml-4 ${faqOpen === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-black mb-4">Bugün Başlayın</h2>
            <p className="text-blue-200 mb-8">14 gün ücretsiz. Kurulum desteği dahil.</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-colors"
            >
              <MessageCircle size={18} />
              Ücretsiz Demo Talep Et
              <ArrowRight size={16} />
            </Link>
            <p className="mt-4 text-xs text-blue-300">
              <Phone size={12} className="inline mr-1" />
              Hemen aramak için: <a href="tel:+908501234567" className="underline">0850 123 45 67</a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-white text-sm">DentFlow AI</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 DentFlow AI. Tüm hakları saklıdır. KVKK Uyumlu.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600">Gizlilik</a>
            <a href="#" className="hover:text-slate-600">Kullanım Koşulları</a>
            <a href="#" className="hover:text-slate-600">KVKK</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
