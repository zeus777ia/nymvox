import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export type Post = {
  id: string
  content: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  account_id: string | null
  ai_generated: boolean
  scheduled_at: string | null
  published_at: string | null
  created_at: string
}

export function usePosts(userId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    if (!userId) {
      setPosts([])
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    setPosts((data as Post[]) || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchPosts().catch(() => setLoading(false))
  }, [fetchPosts])

  const createPost = async (
    content: string,
    accountId: string,
    options: { aiGenerated?: boolean; scheduledAt?: string | null; status?: Post['status'] } = {},
  ) => {
    if (!userId) throw new Error('Oturum yok')
    const status = options.status ?? (options.scheduledAt ? 'scheduled' : 'draft')
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content,
        account_id: accountId,
        ai_generated: options.aiGenerated ?? false,
        scheduled_at: options.scheduledAt ?? null,
        status,
      })
      .select()
      .single()
    if (error) throw error
    if (data) setPosts((prev) => [data as Post, ...prev])
    return data as Post
  }

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length
  const publishedCount = posts.filter((p) => p.status === 'published').length

  return { posts, loading, createPost, refresh: fetchPosts, scheduledCount, publishedCount }
}
