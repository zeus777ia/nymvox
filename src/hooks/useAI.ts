import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAI() {
  const [generating, setGenerating] = useState(false)

  const generateContent = async (prompt: string, platform: string = 'twitter'): Promise<string> => {
    setGenerating(true)
    try {
      const base =
        import.meta.env.VITE_FUNCTIONS_URL ||
        (import.meta.env.VITE_SUPABASE_URL
          ? `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/functions/v1`
          : '')

      if (base) {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const response = await fetch(`${base}/ai-generate`, {
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
      }

      await new Promise((r) => setTimeout(r, 700))
      return `✨ ${prompt} hakkında öne çıkan noktalar:\n\n• Kısa, net ve platforma uygun bir mesaj.\n• Etkileşimi artırmak için soru sor.\n• CTA: yorumlarda fikrini paylaş.`
    } finally {
      setGenerating(false)
    }
  }

  return { generateContent, generating }
}
