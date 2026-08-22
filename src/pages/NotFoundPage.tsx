import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Sayfa bulunamadı</h1>
      <p className="mt-2 text-gray-600 max-w-md">
        Aradığın adres yok veya taşınmış olabilir.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button>Ana sayfa</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
