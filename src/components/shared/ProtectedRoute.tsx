import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <div className="flex items-center justify-center h-screen px-4 text-center">
        <div className="max-w-md space-y-2">
          <p className="font-semibold text-gray-900">Supabase ayarlanmamış</p>
          <p className="text-sm text-gray-600">
            `.env.local` dosyasına <code className="text-indigo-600">VITE_SUPABASE_URL</code> ve{' '}
            <code className="text-indigo-600">VITE_SUPABASE_ANON_KEY</code> ekle.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-sm">Yükleniyor…</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
