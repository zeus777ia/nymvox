import { createPkce } from '@/lib/pkce'

const VERIFIER_KEY = 'nymvox_x_pkce_verifier'

export function xClientId() {
  return (import.meta.env.VITE_X_CLIENT_ID as string | undefined)?.trim() || ''
}

export function xClientSecret() {
  return (import.meta.env.VITE_X_CLIENT_SECRET as string | undefined)?.trim() || ''
}

export function xRedirectUri() {
  return `${window.location.origin}/accounts`
}

export async function startXLogin() {
  const clientId = xClientId()
  if (!clientId) {
    throw new Error('VITE_X_CLIENT_ID yok. developer.x.com’da uygulama oluşturup .env.local’e yaz.')
  }
  const { verifier, challenge } = await createPkce()
  sessionStorage.setItem(VERIFIER_KEY, verifier)
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: xRedirectUri(),
    scope: 'tweet.read tweet.write users.read offline.access',
    state: crypto.randomUUID(),
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })
  window.location.assign(`https://x.com/i/oauth2/authorize?${params.toString()}`)
}

export function takeXVerifier() {
  const v = sessionStorage.getItem(VERIFIER_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
  return v
}

function xApi(path: string) {
  return import.meta.env.DEV ? `/x-api${path}` : `https://api.x.com${path}`
}

export async function exchangeXCode(code: string, verifier: string) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: xRedirectUri(),
    client_id: xClientId(),
    code_verifier: verifier,
  })
  const secret = xClientSecret()
  if (secret) body.set('client_secret', secret)

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  if (secret) {
    headers.Authorization = `Basic ${btoa(`${xClientId()}:${secret}`)}`
  }

  const res = await fetch(xApi('/2/oauth2/token'), {
    method: 'POST',
    headers,
    body,
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'X token alınamadı')
  }
  return data as {
    access_token: string
    refresh_token?: string
    expires_in?: number
  }
}

export async function fetchXMe(accessToken: string) {
  const res = await fetch(xApi('/2/users/me?user.fields=name,username,profile_image_url,public_metrics'), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || data.title || 'X profili alınamadı')
  }
  const u = data.data as {
    id: string
    name: string
    username: string
    profile_image_url?: string
    public_metrics?: { followers_count?: number }
  }
  return u
}
