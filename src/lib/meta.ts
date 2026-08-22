function graph(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  return import.meta.env.DEV ? `/fb-graph/v21.0${p}` : `https://graph.facebook.com/v21.0${p}`
}

async function graphGet<T>(path: string, token: string): Promise<T> {
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(graph(`${path}${sep}access_token=${encodeURIComponent(token)}`))
  const data = await res.json()
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Facebook ${res.status}`)
  }
  return data as T
}

async function graphPost<T>(path: string, token: string, body: Record<string, string>): Promise<T> {
  const params = new URLSearchParams({ ...body, access_token: token })
  const res = await fetch(graph(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })
  const data = await res.json()
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Facebook ${res.status}`)
  }
  return data as T
}

export type FbPage = {
  id: string
  name: string
  access_token: string
  instagram_business_account?: { id: string }
}

export async function fetchFacebookPages(userOrPageToken: string) {
  const me = await graphGet<{ id: string; name?: string; category?: string }>(
    '/me?fields=id,name,category',
    userOrPageToken,
  )
  try {
    const pages = await graphGet<{ data: FbPage[] }>(
      '/me/accounts?fields=id,name,access_token,instagram_business_account',
      userOrPageToken,
    )
    if (pages.data?.length) return pages.data
  } catch {
    /* page token ise /accounts boş olabilir */
  }
  return [
    {
      id: me.id,
      name: me.name || 'Facebook Page',
      access_token: userOrPageToken,
    },
  ] satisfies FbPage[]
}

export async function postToFacebookPage(pageToken: string, pageId: string, message: string) {
  const text = message.trim()
  if (!text) throw new Error('Boş içerik')
  return graphPost<{ id: string }>(`/${pageId}/feed`, pageToken, { message: text })
}
