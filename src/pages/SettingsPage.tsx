import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export function SettingsPage() {
  const { profile, signOut, updateProfile } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFullName(profile?.full_name || '')
    setCompany(profile?.company_name || '')
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({ full_name: fullName, company_name: company })
      addToast('Profil güncellendi', 'success')
    } catch {
      addToast('Kaydedilemedi', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ayarlar</h2>
      <Card className="mb-6 max-w-xl">
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="name">Ad Soyad</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="company">Şirket</Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div>
              <Label>Mevcut Plan</Label>
              <Input value={profile?.plan?.toUpperCase() || 'FREE'} readOnly />
            </div>
            <div>
              <Label>Rol</Label>
              <Input value={profile?.role || 'user'} readOnly className="capitalize" />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Button variant="destructive" onClick={handleLogout}>
        Çıkış Yap
      </Button>
    </div>
  )
}
