import { Tool } from '@modelcontextprotocol/sdk/types.js'

export const tools: Tool[] = [
  {
    name: 'generate_post',
    description: 'Konu ve platform için sosyal medya postu oluştur',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Post konusu' },
        platform: { type: 'string', description: 'Platform (twitter, instagram, linkedin vb.)' },
        tone: { type: 'string', description: 'Ton (profesyonel, samimi, eğlenceli)' },
        language: { type: 'string', description: 'Dil (tr, en)' },
      },
      required: ['topic', 'platform'],
    },
  },
  {
    name: 'schedule_post',
    description: 'Post için optimal zamanı hesapla ve zamanla',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Post içeriği' },
        accountId: { type: 'string', description: 'Sosyal hesap ID' },
        preferredTime: { type: 'string', description: 'Tercih edilen zaman (ISO format)' },
        timezone: { type: 'string', description: 'Zaman dilimi' },
      },
      required: ['content', 'accountId'],
    },
  },
  {
    name: 'get_analytics',
    description: 'Hesap için analitik özeti getir',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Sosyal hesap ID' },
        period: { type: 'string', enum: ['7d', '30d', '90d'], description: 'Dönem' },
      },
      required: ['accountId'],
    },
  },
  {
    name: 'suggest_hashtags',
    description: 'Konu için trend hashtag öner',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Konu' },
        platform: { type: 'string', description: 'Platform' },
        count: { type: 'number', description: 'Kaç hashtag' },
      },
      required: ['topic'],
    },
  },
  {
    name: 'analyze_best_time',
    description: 'Takipçi aktivitesine göre en iyi yayın zamanını analiz et',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Sosyal hesap ID' },
        timezone: { type: 'string', description: 'Zaman dilimi' },
      },
      required: ['accountId'],
    },
  },
]

export const handlers: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  generate_post: async ({ topic, platform, tone = 'profesyonel', language = 'tr' }) => {
    const tones: Record<string, string> = {
      profesyonel: 'Profesyonel ve bilgilendirici',
      samimi: 'Samimi ve sıcak',
      eglenceli: 'Eğlenceli ve enerjik',
    }

    const platforms: Record<string, string> = {
      twitter: 'Twitter/X',
      instagram: 'Instagram',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      facebook: 'Facebook',
    }

    const content = `${topic} hakkında ${tones[tone as string] || tones.profesyonel} bir ${platforms[platform as string] || platform} postu.`

    return {
      content,
      hashtags: [`#${String(topic).replace(/\s+/g, '')}`, `#${String(platform)}`, '#trend'],
      suggestedTime: '14:00',
      characterCount: content.length,
    }
  },

  schedule_post: async ({ content, accountId, preferredTime, timezone = 'Europe/Istanbul' }) => {
    const scheduledTime = preferredTime
      ? new Date(preferredTime as string)
      : new Date(Date.now() + 24 * 60 * 60 * 1000)

    return {
      scheduled: true,
      postId: `post_${Date.now()}`,
      accountId,
      content: String(content).slice(0, 280),
      scheduledAt: scheduledTime.toISOString(),
      timezone,
      status: 'pending',
    }
  },

  get_analytics: async ({ accountId, period = '30d' }) => {
    const periods: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }
    const days = periods[period as string] || 30

    return {
      accountId,
      period,
      summary: {
        postsPublished: Math.floor(Math.random() * 50),
        totalEngagement: Math.floor(Math.random() * 5000),
        totalReach: Math.floor(Math.random() * 50000),
        newFollowers: Math.floor(Math.random() * 200),
        engagementRate: (Math.random() * 5 + 1).toFixed(2),
      },
      dailyStats: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 30),
        reach: Math.floor(Math.random() * 2000),
      })),
    }
  },

  suggest_hashtags: async ({ topic, platform = 'twitter', count = 5 }) => {
    const baseHashtags = [
      `#${String(topic).replace(/\s+/g, '')}`,
      `#${String(platform)}`,
      '#sosyalmedya',
      '#içerik',
      '#trend',
      '#viral',
      '#keşfet',
      '#türkiye',
      '#bugün',
      '#yenilik',
    ]

    return {
      topic,
      platform,
      hashtags: baseHashtags.slice(0, count as number),
      suggested: baseHashtags.slice(count as number, (count as number) + 3),
    }
  },

  analyze_best_time: async ({ accountId, timezone = 'Europe/Istanbul' }) => {
    const bestTimes = ['09:00', '12:00', '14:00', '17:00', '19:00', '21:00']

    return {
      accountId,
      timezone,
      bestTimes: bestTimes.map(time => ({
        time,
        engagementScore: Math.floor(Math.random() * 100),
        reason: `${time} saatinde takipçi aktivitesi yüksek`,
      })).sort((a, b) => b.engagementScore - a.engagementScore),
      recommendation: 'Hafta içi 12:00-14:00 ve 19:00-21:00 saatleri arasında yayın yapmanız önerilir.',
    }
  },
}
