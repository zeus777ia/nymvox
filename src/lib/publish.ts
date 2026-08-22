import { publishWithAccount as publishX } from '@/lib/x-publish'
import { postToFacebookPage } from '@/lib/meta'

export async function publishWithAccount(
  account: {
    id: string
    platform: string
    access_token?: string | null
    refresh_token?: string | null
    oauth_user_id?: string | null
  },
  content: string,
) {
  switch (account.platform) {
    case 'twitter':
      return publishX(account, content)
    case 'facebook':
      if (!account.access_token || !account.oauth_user_id) {
        throw new Error('Facebook Page token/id yok. Hesaplar’dan Page token yapıştır.')
      }
      return postToFacebookPage(account.access_token, account.oauth_user_id, content)
    case 'instagram':
      throw new Error('Instagram API metin post kabul etmez — görsel/Reels şart + Business hesap.')
    case 'tiktok':
      throw new Error('TikTok Content Posting API video + uygulama incelemesi ister. Metin basılmaz.')
    default:
      throw new Error(`${account.platform} henüz bağlı değil`)
  }
}
