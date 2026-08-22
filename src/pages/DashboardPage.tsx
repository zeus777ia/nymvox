import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { usePosts } from '@/hooks/usePosts'
import { useSocialAccounts } from '@/hooks/useSocialAccounts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus, Calendar, BarChart3, Link2, Sparkles, TrendingUp } from 'lucide-react'
import { DashboardSkeleton } from '@/components/shared/Skeletons'
import { platformName } from '@/lib/platforms'

export function DashboardPage() {
  const { user, profile } = useAuth()
  const { limits, loading } = useSubscription(user?.id)
  const { posts, loading: postsLoading, scheduledCount, publishedCount } = usePosts(user?.id)
  const { accounts } = useSocialAccounts(user?.id)

  if (loading || postsLoading) return <DashboardSkeleton />

  const recent = posts.slice(0, 5)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Hoş Geldin, {profile?.full_name || 'Kullanıcı'}</h2>
          <p className="text-gray-600">
            Plan: <span className="font-semibold capitalize">{profile?.plan || 'free'}</span>
          </p>
        </div>
        <Link to="/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Yeni Post
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Bağlı Hesap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {accounts.length}
              <span className="text-sm font-normal text-gray-500">
                {' '}
                / {limits.accounts === Infinity ? '∞' : limits.accounts}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{limits.platforms.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Planlanan Post</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{scheduledCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Yayınlanan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{publishedCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/accounts">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <Link2 className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold">Hesapları Yönet</h3>
              <p className="text-sm text-gray-600">Sosyal medya hesaplarını bağla ve yönet</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/calendar">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <Calendar className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold">Takvimi Gör</h3>
              <p className="text-sm text-gray-600">İçerik takvimini görüntüle ve düzenle</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/analytics">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <BarChart3 className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold">Analitik</h3>
              <p className="text-sm text-gray-600">Performans verilerini incele</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              AI ile Hızlı Başla
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">AI asistanınla birkaç dakika içinde etkileyici içerik oluştur.</p>
            <Link to="/create">
              <Button variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" /> İçerik Oluştur
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-gray-600">Henüz bir aktivite yok. İlk postunu oluşturmak için hazırsın!</p>
            ) : (
              <ul className="space-y-3">
                {recent.map((p) => (
                  <li key={p.id} className="text-sm border-b border-gray-100 last:border-0 pb-2">
                    <p className="text-gray-800 line-clamp-2">{p.content}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {p.status} · {new Date(p.created_at).toLocaleString('tr-TR')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {accounts.length > 0 && (
        <p className="text-xs text-gray-500 mt-6">
          Bağlı: {accounts.map((a) => platformName(a.platform)).join(', ')}
        </p>
      )}
    </div>
  )
}
