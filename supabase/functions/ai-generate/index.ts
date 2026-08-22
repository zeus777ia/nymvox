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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (openaiApiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
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
        return json({
          content,
          hashtags: [`#${input.replace(/\s+/g, '')}`, `#${platform}`, '#nymvox'],
          platform,
          tone,
          aiGenerated: true,
        })
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
