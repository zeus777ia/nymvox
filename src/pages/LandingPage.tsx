import { HeroSection } from '@/sections/landing/HeroSection'
import { FeaturesSection } from '@/sections/landing/FeaturesSection'
import { PricingCards } from '@/sections/pricing/PricingCards'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="bg-white/90 backdrop-blur border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Nymvox
        </Link>
        <div className="flex gap-2 md:gap-4">
          <Link to="/login">
            <Button variant="ghost">Giriş Yap</Button>
          </Link>
          <Link to="/register">
            <Button>Ücretsiz Başla</Button>
          </Link>
        </div>
      </nav>
      <HeroSection />
      <FeaturesSection />
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Basit ve Şeffaf Fiyatlandırma</h2>
          <p className="text-center text-gray-600 mb-12">İhtiyacına uygun paketi seç, istediğin zaman değiştir</p>
          <PricingCards />
        </div>
      </section>
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Hemen Başla</h2>
          <p className="text-indigo-100 mb-8">Ücretsiz plan ile başla, büyüdükçe yükselt. Kredi kartı gerekmez.</p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Ücretsiz Hesap Oluştur
            </Button>
          </Link>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Nymvox. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <a href="#pricing" className="hover:text-white">
              Fiyatlar
            </a>
            <Link to="/login" className="hover:text-white">
              Giriş
            </Link>
            <a href="https://github.com/zeus777ia/nymvox" className="hover:text-white" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
