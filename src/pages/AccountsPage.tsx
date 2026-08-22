import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSocialAccounts } from '@/hooks/useSocialAccounts'
import { useSubscription } from '@/hooks/useSubscription'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Link2 } from 'lucide-react'
import { CardSkeleton } from '@/components/shared/Skeletons'
import { PLATFORMS, platformName } from '@/lib/platforms'
import { Link } from 'react-router-dom'

export function AccountsPage() {
  const { user } = useAuth()
  const { accounts, loading, addAccount, removeAccount } = useSocialAccounts(user?.id)
  const { limits } = useSubscription(user?.id)
  const { addToast } = useToast()
  const [newPlatform, setNewPlatform] = useState('twitter')
  const [newName, setNewName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const canAdd = limits.accounts === Infinity || accounts.length < limits.accounts
  const availablePlatforms = limits.platforms

  const handleAdd = async () => {
    if (!newName || !canAdd) return
    try {
      await addAccount(newPlatform, newName)
      addToast('Hesap başarıyla eklendi!', 'success')
      setNewName('')
      setDialogOpen(false)
    } catch {
      addToast('Hesap eklenemedi. SQL şemasını Supabase’te çalıştırdın mı?', 'error')
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

  if (loading) return <CardSkeleton count={3} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold">Sosyal Medya Hesapları</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canAdd} className="gap-2">
              <Plus className="w-4 h-4" /> Hesap Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Hesap Ekle</DialogTitle>
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
              <p className="text-xs text-gray-500">
                Canlı OAuth (Twitter, Instagram…) henüz mock. Platform uygulama anahtarları eklenince edge function
                `social-oauth` devreye girer.
              </p>
            </div>
          </DialogContent>
        </Dialog>
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
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-700 shrink-0">
                  {account.platform.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{account.account_name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {platformName(account.platform)} · {account.account_handle}
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
          <p className="text-sm text-gray-500 mb-4">Sosyal medya hesaplarını bağlamak için başla.</p>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> İlk Hesabını Ekle
          </Button>
        </div>
      )}
    </div>
  )
}
