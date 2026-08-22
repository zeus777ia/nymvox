import { CalendarDays, Bot, BarChart3, Users, Shield, Globe } from 'lucide-react'

const features = [
  { icon: CalendarDays, title: 'İçerik Takvimi', desc: 'Ay görünümü ile taslak, planlı ve yayınlanan postları gör.' },
  { icon: Bot, title: 'AI Asistan', desc: 'Konu yaz, platforma uygun post üret. Edge function veya yerel fallback.' },
  { icon: BarChart3, title: 'Detaylı Analitik', desc: 'Etkileşim, erişim ve paylaşım özetini tek ekranda gör.' },
  { icon: Users, title: 'Takım ve Planlar', desc: 'Free’den Business’a kadar hesap / platform limitleri.' },
  { icon: Shield, title: 'Güvenli Bağlantı', desc: 'Supabase Auth + RLS. Verin sadece sana açık.' },
  { icon: Globe, title: '7 Platform', desc: 'Twitter, Instagram, LinkedIn, TikTok, Facebook, YouTube, Pinterest.' },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Neden Nymvox?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors">
              <Icon className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
