'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '@/app/store/profileSlice'
import { HNStory } from '@/app/types/types'

export default function MyPostsPage() {
  const profileState = useSelector(
    (s: unknown) => (s as { profile: StoreProfileState }).profile,
  ) as StoreProfileState
  const username = profileState.username || ''

  const [stories, setStories] = useState<HNStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        if (!username) return
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const url = `${API_BASE}/story/author/${encodeURIComponent(username)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(await res.text())
        const data = (await res.json()) as HNStory[]
        setStories([...data].sort((a, b) => (b.created_at_i ?? 0) - (a.created_at_i ?? 0)))
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load posts'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [username])

  const formatDate = (ts?: number) => {
    if (!ts) return '—'
    const d = new Date(ts * 1000)
    return d.toLocaleString()
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-2 max-w-5xl mx-auto">
        <Link href="/profile" className="text-sm text-gray-700 hover:text-blue-700 !no-underline">
          &lt; Back
        </Link>
      </div>
      <div className="max-w-5xl mx-auto rounded-lg bg-white shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">All Posts</h2>
          {username && <span className="text-sm text-gray-600">@{username}</span>}
        </div>
        {loading && <div className="text-sm text-gray-600">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-3">
            {stories.length === 0 ? (
              <p className="text-gray-600 text-sm">No posts yet.</p>
            ) : (
              stories.map((s) => (
                <div key={s.story_id} className="border rounded p-3">
                  <Link
                    href={`/details/${s.story_id}`}
                    className="font-medium hover:text-orange-500"
                  >
                    {s.title}
                  </Link>
                  <div className="mt-1 text-xs text-gray-500">
                    <span>Points: {s.points ?? 0}</span>
                    <span className="mx-2">•</span>
                    <span>Comments: {s.commentCount ?? 0}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(s.created_at_i)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
