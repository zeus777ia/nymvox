export const PLATFORMS = [
  { id: 'twitter', name: 'Twitter / X', limit: 280 },
  { id: 'instagram', name: 'Instagram', limit: 2200 },
  { id: 'linkedin', name: 'LinkedIn', limit: 3000 },
  { id: 'tiktok', name: 'TikTok', limit: 2200 },
  { id: 'facebook', name: 'Facebook', limit: 5000 },
  { id: 'youtube', name: 'YouTube', limit: 5000 },
  { id: 'pinterest', name: 'Pinterest', limit: 500 },
] as const

export type PlatformId = (typeof PLATFORMS)[number]['id']

export function platformName(id: string) {
  return PLATFORMS.find((p) => p.id === id)?.name ?? id
}

export function platformLimit(id: string) {
  return PLATFORMS.find((p) => p.id === id)?.limit ?? 280
}
