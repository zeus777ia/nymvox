import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSocialAccounts } from '@/hooks/useSocialAccounts'
import { useSubscription } from '@/hooks/useSubscription'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Link2, Loader2 } from 'lucide-react'
import { CardSkeleton } from '@/components/shared/Skeletons'
import { PLATFORMS, platformName } from '@/lib/platforms'
import { Link, useSearchParams } from 'react-router-dom'
import { exchangeXCode, fetchXMe, startXLogin, takeXVerifier } from '@/lib/x-oauth'
import { fetchFacebookPages } from '@/lib/meta'

export function AccountsPage() {
  const { user } = useAuth()
  const { accounts, loading, addAccount, upsertOAuthAccount, removeAccount } = useSocialAccounts(user?.id)
  const { limits } = useSubscription(user?.id)
  const { addToast } = useToast()
  const [newPlatform, setNewPlatform] = useState('twitter')
  const [newName, setNewName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [oauthBusy, setOauthBusy] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [fbToken, setFbToken] = useState('')

  const canAdd = limits.accounts === Infinity || accounts.length < limits.accounts
  const availablePlatforms = limits.platforms

  const saveXProfile = async (access: string, refresh?: string, expiresIn?: number) => {
    const me = await fetchXMe(access)
    await upsertOAuthAccount({
      platform: 'twitter',
      account_name: me.name,
      account_handle: `@${me.username}`,
      profile_image_url: me.profile_image_url,
      followers_count: me.public_metrics?.followers_count,
      oauth_user_id: me.id,
      access_token: access,
      refresh_token: refresh,
      token_expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : undefined,
    })
    addToast(`@${me.username} bağlandı`, 'success')
  }

  useEffect(() => {
    const code = searchParams.get('code')
    const err = searchParams.get('error')
    if (err) {
      addToast(`X yetkisi reddedildi: ${err}`, 'error')
      setSearchParams({}, { replace: true })
      return
    }
    if (!code || !user) return

    const run = async () => {
      setOauthBusy(true)
      try {
        const verifier = takeXVerifier()
        if (!verifier) throw new Error('Oturum PKCE kodu kayıp. Tekrar “X ile bağla”ya bas.')
        const tokens = await exchangeXCode(code, verifier)
        await saveXProfile(tokens.access_token, tokens.refresh_token, tokens.expires_in)
      } catch (e) {
        addToast(e instanceof Error ? e.message : 'X bağlanamadı', 'error')
      } finally {
        setOauthBusy(false)
        setSearchParams({}, { replace: true })
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user])

  const handleAdd = async () => {
    if (!newName || !canAdd) return
    try {
      await addAccount(newPlatform, newName)
      addToast('Hesap eklendi (manuel). Gerçek paylaşım için OAuth gerekir.', 'success')
      setNewName('')
      setDialogOpen(false)
    } catch {
      addToast('Hesap eklenemedi.', 'error')
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await removeAccount(id)
      addToast('Hesap silindi', 'success')
    } catch {
      addToast('Hesap silinirken hata oluştu', 'error')
    }
  }

  const handleX = async () => {
    if (!canAdd) return
    try {
      await startXLogin()
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'X başlatılamadı', 'error')
    }
  }

  const handlePasteTokens = async () => {
    if (!accessToken.trim()) {
      addToast('Access Token yapıştır', 'error')
      return
    }
    setOauthBusy(true)
    try {
      await saveXProfile(accessToken.trim(), refreshToken.trim() || undefined, 7200)
      setAccessToken('')
      setRefreshToken('')
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Token geçersiz', 'error')
    } finally {
      setOauthBusy(false)
    }
  }

  const handleFacebookToken = async () => {
    if (!fbToken.trim()) {
      addToast('Facebook Page token yapıştır', 'error')
      return
    }
    setOauthBusy(true)
    try {
      const pages = await fetchFacebookPages(fbToken.trim())
      for (const page of pages) {
        await upsertOAuthAccount({
          platform: 'facebook',
          account_name: page.name,
          account_handle: page.id,
          oauth_user_id: page.id,
          access_token: page.access_token,
        })
      }
      addToast(`${pages.length} Facebook Page bağlandı`, 'success')
      setFbToken('')
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Facebook bağlanamadı', 'error')
    } finally {
      setOauthBusy(false)
    }
  }

  if (loading) return <CardSkeleton count={3} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold">Sosyal Medya Hesapları</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canAdd} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Manuel ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manuel hesap (OAuth yok)</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.filter((p) => availablePlatforms.includes(p.id)).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Hesap Adı" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Button onClick={handleAdd} disabled={!newName} className="w-full">
                Ekle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {oauthBusy && (
        <div className="flex items-center gap-2 text-sm text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Hesap bağlanıyor…
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        <Card>
          <CardContent className="pt-5 space-y-3">
            <p className="font-semibold">Facebook Page</p>
            <p className="text-xs text-gray-500">Metin post basılır. Kişisel profil değil, Page token gerekir.</p>
            <Input
              placeholder="Page Access Token"
              value={fbToken}
              onChange={(e) => setFbToken(e.target.value)}
            />
            <Button onClick={handleFacebookToken} disabled={!canAdd || oauthBusy || !fbToken} className="w-full">
              Facebook bağla
            </Button>
            <p className="text-xs text-gray-500">
              Token:{' '}
              <a
                className="underline"
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noreferrer"
              >
                Graph API Explorer
              </a>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 space-y-3">
            <p className="font-semibold">Twitter / X</p>
            <p className="text-xs text-gray-500">API kredi ister (pay-per-use). İstersen token ile dene.</p>
            <Button onClick={handleX} disabled={!canAdd || oauthBusy} variant="outline" className="w-full">
              X ile bağla
            </Button>
            <details className="text-xs text-gray-600">
              <summary className="cursor-pointer font-medium">X panel tokeni ile bağla</summary>
              <div className="mt-2 space-y-2">
                <Input
                  placeholder="Access Token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <Input
                  placeholder="Refresh Token"
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                />
                <Button size="sm" onClick={handlePasteTokens} disabled={oauthBusy || !accessToken} className="w-full">
                  Token ile bağla
                </Button>
              </div>
            </details>
          </CardContent>
        </Card>
        <Card className="opacity-90">
          <CardContent className="pt-5 space-y-3">
            <p className="font-semibold">Instagram</p>
            <p className="text-xs text-gray-500">
              Metin post yok. Business/Creator + Facebook Page + her postta görsel/Reels. App Review şart.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Görsel akışı sonra
            </Button>
          </CardContent>
        </Card>
        <Card className="opacity-90">
          <CardContent className="pt-5 space-y-3">
            <p className="font-semibold">TikTok</p>
            <p className="text-xs text-gray-500">
              Sadece video. Content Posting API + TikTok uygulama incelemesi. Metin basılmaz.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Video akışı sonra
            </Button>
          </CardContent>
        </Card>
        <Card className="opacity-80">
          <CardContent className="pt-5 space-y-3">
            <p className="font-semibold">LinkedIn</p>
            <p className="text-xs text-gray-500">LinkedIn app + Company Page token. İstersen sonraki adım.</p>
            <Button variant="outline" className="w-full" disabled>
              Yakında
            </Button>
          </CardContent>
        </Card>
      </div>

      {!canAdd && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6 text-sm">
          Hesap limitine ulaştınız.{' '}
          <Link to="/billing" className="underline font-medium">
            Planını yükselt
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {account.profile_image_url ? (
                  <img src={account.profile_image_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-700 shrink-0">
                    {account.platform.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold truncate">{account.account_name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {platformName(account.platform)} · {account.account_handle}
                    {account.oauth_user_id ? ' · OAuth' : ' · manuel'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemove(account.id)} aria-label="Sil">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
          <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Henüz bağlı hesabın yok.</p>
          <p className="text-sm text-gray-500">X ile bağla veya token yapıştır.</p>
        </div>
      )}
    </div>
  )
}
