import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { json, optionsResponse } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return optionsResponse()

  const url = new URL(req.url)
  const platform = url.searchParams.get('platform')
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  if (!platform || !code) {
    return json({ error: 'platform ve code parametreleri gerekli' }, 400)
  }

  try {
    // Production: platform OAuth token exchange using env secrets
    // TWITTER_CLIENT_ID / INSTAGRAM_CLIENT_ID / ...
    const mockPlatforms: Record<string, { name: string; handle: string }> = {
      twitter: { name: 'Twitter Hesabı', handle: '@twitter_user' },
      instagram: { name: 'Instagram Hesabı', handle: '@instagram_user' },
      linkedin: { name: 'LinkedIn Hesabı', handle: 'linkedin-user' },
      tiktok: { name: 'TikTok Hesabı', handle: '@tiktok_user' },
      facebook: { name: 'Facebook Hesabı', handle: 'facebook.user' },
    }

    const account = mockPlatforms[platform] || { name: 'Hesap', handle: '@user' }

    return json({
      success: true,
      platform,
      state,
      account: {
        name: account.name,
        handle: account.handle,
        accessToken: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Bilinmeyen hata' }, 500)
  }
})
