import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, BarChart3, Calendar } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-indigo-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 mb-6">
          AI destekli sosyal medya stüdyosu
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Tüm Sosyal Medyanı
          <br />
          <span className="text-indigo-600">Tek Yerden Yönet</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Nymvox ile içerik planla, AI ile üret, analiz et ve büyü. 7 platform, 1 panel, sınırsız imkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Ücretsiz Başla <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Giriş Yap
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" /> AI İçerik
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" /> Akıllı Takvim
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Detaylı Analitik
          </div>
        </div>
      </div>
    </section>
  )
}
