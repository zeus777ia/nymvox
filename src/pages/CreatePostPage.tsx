import { useMemo, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSocialAccounts } from '@/hooks/useSocialAccounts'
import { usePosts } from '@/hooks/usePosts'
import { useAI } from '@/hooks/useAI'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Send, Wand2, Loader2, CalendarClock } from 'lucide-react'
import { platformLimit, platformName } from '@/lib/platforms'
import { Link } from 'react-router-dom'

export function CreatePostPage() {
  const { user } = useAuth()
  const { accounts, loading: accountsLoading } = useSocialAccounts(user?.id)
  const { createPost } = usePosts(user?.id)
  const { generateContent, generating } = useAI()
  const { addToast } = useToast()
  const [content, setContent] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [saving, setSaving] = useState(false)
  const [usedAI, setUsedAI] = useState(false)

  const account = accounts.find((a) => a.id === selectedAccount)
  const limit = platformLimit(account?.platform ?? 'twitter')
  const overLimit = content.length > limit

  const canSave = useMemo(
    () => Boolean(content.trim() && selectedAccount && !overLimit),
    [content, selectedAccount, overLimit],
  )

  const handleGenerate = async () => {
    if (!aiPrompt) {
      addToast('Lütfen bir konu girin', 'error')
      return
    }
    try {
      const generated = await generateContent(aiPrompt, account?.platform ?? 'twitter')
      setContent(generated)
      setUsedAI(true)
      addToast('AI içerik oluşturuldu!', 'success')
    } catch {
      addToast('İçerik oluşturulurken hata oluştu', 'error')
    }
  }

  const save = async (mode: 'draft' | 'scheduled') => {
    if (!canSave) {
      addToast('İçerik ve hesap gerekli', 'error')
      return
    }
    if (mode === 'scheduled' && !scheduledAt) {
      addToast('Zamanlama için tarih seç', 'error')
      return
    }
    setSaving(true)
    try {
      await createPost(content, selectedAccount, {
        aiGenerated: usedAI,
        scheduledAt: mode === 'scheduled' ? new Date(scheduledAt).toISOString() : null,
        status: mode === 'scheduled' ? 'scheduled' : 'draft',
      })
      setContent('')
      setAiPrompt('')
      setScheduledAt('')
      setUsedAI(false)
      addToast(mode === 'scheduled' ? 'Post zamanlandı!' : 'Taslak kaydedildi!', 'success')
    } catch {
      addToast('Post kaydedilirken hata oluştu. Supabase şemasını çalıştırdın mı?', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">İçerik Oluştur</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-600" /> AI ile Oluştur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Konu veya anahtar kelimeler girin... (örn: Yapay zeka trendleri)"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={4}
            />
            <Button onClick={handleGenerate} disabled={generating || !aiPrompt} className="gap-2 w-full">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? 'AI Düşünüyor...' : 'AI ile Oluştur'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Post Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accounts.length === 0 && !accountsLoading ? (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">
                Önce bir hesap ekle.{' '}
                <Link to="/accounts" className="underline font-medium">
                  Hesaplar
                </Link>
              </p>
            ) : (
              <Select value={selectedAccount || undefined} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder={accountsLoading ? 'Yükleniyor...' : 'Hesap Seç'} />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.account_name} ({platformName(a.platform)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Textarea
              placeholder="İçeriğinizi yazın veya AI ile oluşturun..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{content.length} karakter</span>
              <span className={overLimit ? 'text-red-500 font-medium' : ''}>
                {overLimit ? `${content.length - limit} fazla` : `${limit - content.length} kalan`}
                {account ? ` · ${platformName(account.platform)}` : ''}
              </span>
            </div>
            <div>
              <Label htmlFor="when" className="flex items-center gap-1 mb-1">
                <CalendarClock className="w-3.5 h-3.5" /> Zamanla (opsiyonel)
              </Label>
              <Input
                id="when"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => save('draft')} disabled={!canSave || saving} variant="outline" className="gap-2">
                <Send className="w-4 h-4" /> Taslak
              </Button>
              <Button onClick={() => save('scheduled')} disabled={!canSave || saving || !scheduledAt} className="gap-2">
                <CalendarClock className="w-4 h-4" /> Zamanla
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
