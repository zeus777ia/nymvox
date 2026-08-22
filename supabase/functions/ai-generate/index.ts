import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { json, optionsResponse } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return optionsResponse()
  if (req.method !== 'POST') {
    return json({ error: 'Sadece POST desteklenir' }, 405)
  }

  try {
    const { prompt, topic, platform = 'twitter', tone = 'profesyonel' } = await req.json()
    const input = (prompt || topic || '').toString().trim()
    if (!input) {
      return json({ error: 'prompt veya topic gereklidir' }, 400)
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('FREELLM_API_KEY')
    const base = Deno.env.get('LLM_BASE_URL') || 'https://v1-freedoom.com/v1'

    if (openaiApiKey) {
      const response = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: Deno.env.get('LLM_MODEL') || 'auto',
          messages: [
            {
              role: 'system',
              content: `Sen Nymvox sosyal medya asistanısın. ${platform} için ${tone} tonda, Türkçe kısa bir post yaz. Hashtag ekle.`,
            },
            { role: 'user', content: input },
          ],
          temperature: 0.8,
          max_tokens: 400,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        const content = data.choices?.[0]?.message?.content ?? ''
        if (content) {
          return json({
            content,
            hashtags: [`#${input.replace(/\s+/g, '')}`, `#${platform}`, '#nymvox'],
            platform,
            tone,
            aiGenerated: true,
          })
        }
      }
    }

    const mockContents: Record<string, string> = {
      twitter: `🚀 ${input} konusunda önemli gelişmeler! İşte bilmeniz gerekenler...`,
      instagram: `✨ ${input} ile ilgili ilham verici bir içerik! Kaydetmeyi unutmayın.`,
      linkedin: `Profesyonel bakış açısıyla ${input} analizi: Önemli noktalar ve stratejiler.`,
      tiktok: `🔥 ${input} trendi hakkında bilmen gereken her şey! #trend #keşfet`,
      facebook: `Bugün ${input} hakkında konuşalım! Yorumlarda fikirlerinizi paylaşın.`,
    }

    const content = mockContents[platform] || mockContents.twitter

    return json({
      content,
      hashtags: [`#${input.replace(/\s+/g, '')}`, `#${platform}`, '#trend', '#sosyalmedya'],
      platform,
      tone,
      aiGenerated: true,
      mock: !openaiApiKey,
    })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Bilinmeyen hata' }, 500)
  }
})
