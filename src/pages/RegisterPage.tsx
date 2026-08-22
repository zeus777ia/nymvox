import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }
    setLoading(true)
    const { data, error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.user && !data.session) {
      setInfo('Kayıt başarılı. E-posta doğrulama açıksa gelen kutunu kontrol et, sonra giriş yap.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Nymvox'a Kayıt Ol</CardTitle>
          <CardDescription>Yeni hesap oluşturun</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {info && (
              <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 p-3 rounded">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {info}
              </div>
            )}
            <div>
              <Label htmlFor="name">Ad Soyad</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Kaydediliyor…' : 'Kayıt Ol'}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Zaten hesabın var?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Giriş Yap
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
