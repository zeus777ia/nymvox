import { supabase } from '@/lib/supabase'
import { xClientId, xClientSecret } from '@/lib/x-oauth'

function xApi(path: string) {
  return import.meta.env.DEV ? `/x-api${path}` : `https://api.x.com${path}`
}

function xError(status: number, data: Record<string, unknown>) {
  const raw = String(data.detail || data.title || data.error || '')
  if (status === 402 || /credit/i.test(raw)) {
    return 'X API kredi yok. developer.x.com → Billing’den pay-per-use kredi yükle. Ücretsiz planda tweet basılmaz.'
  }
  if (status === 401) return 'X token süresi doldu. Hesaplar → tokeni yenile.'
  if (status === 403) return 'X izin vermedi (403). App permissions Read and write + Project + kredi kontrol et.'
  return `X_${status}: ${raw || 'paylaşım hatası'}`
}

export async function refreshXToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: xClientId(),
  })
  const secret = xClientSecret()
  if (secret) body.set('client_secret', secret)
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  if (secret) headers.Authorization = `Basic ${btoa(`${xClientId()}:${secret}`)}`

  const res = await fetch(xApi('/2/oauth2/token'), { method: 'POST', headers, body })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'X token yenilenemedi')
  }
  return data as { access_token: string; refresh_token?: string; expires_in?: number }
}

export async function postToX(accessToken: string, text: string) {
  const trimmed = text.trim().slice(0, 280)
  if (!trimmed) throw new Error('Boş içerik')
  const res = await fetch(xApi('/2/tweets'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: trimmed }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(xError(res.status, data))
  return data as { data?: { id: string } }
}

export async function publishWithAccount(
  account: {
    id: string
    platform: string
    access_token?: string | null
    refresh_token?: string | null
  },
  content: string,
) {
  if (account.platform !== 'twitter') {
    throw new Error(`${account.platform} paylaşımı henüz yok — sadece X`)
  }
  let token = account.access_token
  if (!token) throw new Error('Bu hesapta OAuth token yok. Hesaplar → token ile bağla.')

  try {
    return await postToX(token, content)
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (!account.refresh_token || !msg.includes('token süresi')) throw err
    const refreshed = await refreshXToken(account.refresh_token)
    token = refreshed.access_token
    await supabase
      .from('social_accounts')
      .update({
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token ?? account.refresh_token,
        token_expires_at: refreshed.expires_in
          ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
          : null,
      })
      .eq('id', account.id)
    return await postToX(token, content)
  }
}
