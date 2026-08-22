import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const PLATFORM_STYLE: Record<string, string> = {
  twitter: 'Twitter/X: max 280 karakter, 1-2 hashtag, vurucu tek post.',
  instagram: 'Instagram: 2-3 kısa paragraf, emoji, 5-8 hashtag.',
  linkedin: 'LinkedIn: profesyonel, 3-4 cümle, CTA ile bitir.',
  tiktok: 'TikTok: konuşma dili, kısa, 3-5 hashtag.',
  facebook: 'Facebook: samimi, soru ile biten paylaşım.',
}

function localGenerate(prompt: string, platform: string): string {
  const topic = prompt.trim()
  const tag = topic
    .toLocaleLowerCase('tr')
    .replace(/[^a-z0-9ğüşöçı\s]/gi, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join('')
  const templates: Record<string, string> = {
    twitter: `${topic} üzerine net bir not:\n\nAsıl mesele hız değil, tutarlılık. Bugün 1 içerik, her gün 1 içerik.\n\nSen bu konuda ne düşünüyorsun?\n\n#${tag || 'icerik'} #nymvox`,
    instagram: `✨ ${topic}\n\nKısa not: izleyici tek bakışta değeri anlamalı.\nKaydet, sonra dene — yorumda sonucu yaz.\n\n#${tag || 'icerik'} #sosyalmedya #nymvox #keşfet #iceriküretimi`,
    linkedin: `${topic} hakkında saha notu:\n\n1) Mesajı tek cümlede söyle.\n2) Kanıt veya örnek ekle.\n3) Net bir CTA ile kapat.\n\nSizde bu iş nasıl yürüyor?`,
    tiktok: `${topic} için hızlı kanca:\n\n“Bunu yanlış biliyordun.” → 3 saniyede değer ver → CTA.\n\n#${tag || 'fyp'} #keşfet #nymvox`,
    facebook: `Bugün ${topic} hakkında konuşalım.\n\nSizin deneyiminiz nasıl? Yorumlara yazın — en iyi ipucunu sabah derleyeceğim.`,
  }
  return templates[platform] || templates.twitter
}

async function tryChatCompletions(
  url: string,
  apiKey: string | undefined,
  prompt: string,
  platform: string,
): Promise<string | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'auto',
      messages: [
        {
          role: 'system',
          content: `Sen Nymvox içerik asistanısın. Türkçe yaz. ${PLATFORM_STYLE[platform] || PLATFORM_STYLE.twitter}`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 400,
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content
  return typeof text === 'string' && text.trim() ? text.trim() : null
}

export function useAI() {
  const [generating, setGenerating] = useState(false)

  const generateContent = async (prompt: string, platform: string = 'twitter'): Promise<string> => {
    setGenerating(true)
    try {
      const key = import.meta.env.VITE_AI_API_KEY as string | undefined
      const remoteBase = (import.meta.env.VITE_AI_BASE_URL as string | undefined) || 'https://v1-freedoom.com/v1'
      const localUrl = '/llm/chat/completions'
      const remoteUrl = `${remoteBase.replace(/\/$/, '')}/chat/completions`

      if (key) {
        const first = import.meta.env.DEV ? localUrl : remoteUrl
        try {
          const viaProxy = await tryChatCompletions(first, key, prompt, platform)
          if (viaProxy) return viaProxy
        } catch {
          /* proxy yoksa doğrudan dene */
        }
        try {
          const direct = await tryChatCompletions(remoteUrl, key, prompt, platform)
          if (direct) return direct
        } catch {
          /* edge / mock */
        }
      }

      const fnBase =
        import.meta.env.VITE_FUNCTIONS_URL ||
        (import.meta.env.VITE_SUPABASE_URL
          ? `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/functions/v1`
          : '')
      if (fnBase) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          const response = await fetch(`${fnBase}/ai-generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
              Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
            },
            body: JSON.stringify({ prompt, platform }),
          })
          if (response.ok) {
            const data = await response.json()
            if (data.content) return data.content as string
          }
        } catch {
          /* local fallback */
        }
      }

      return localGenerate(prompt, platform)
    } finally {
      setGenerating(false)
    }
  }

  return { generateContent, generating }
}
