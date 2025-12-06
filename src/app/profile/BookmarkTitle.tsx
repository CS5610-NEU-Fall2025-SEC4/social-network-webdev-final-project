'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function BookmarkTitle({ id }: { id: string }) {
  const [title, setTitle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    const isNumeric = /^\d+$/.test(id)
    const fetchTitle = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
        const endpoint = isNumeric
          ? `https://hn.algolia.com/api/v1/items/${encodeURIComponent(id)}`
          : `${base}/story/${encodeURIComponent(id)}/full`
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = (await res.json()) as {
          title?: string
          author?: string
          type?: string
          text?: string
        }
        if (!cancelled) {
          const isComment = data.type === 'comment'
          const deriveFromText = (html?: string) =>
            (html || '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 80)
          const label =
            data.title && data.title.trim() !== ''
              ? data.title
              : isComment
                ? `Comment by ${data.author ?? 'unknown'}`
                : deriveFromText(data.text) || `Story ${id}`
          setTitle(label)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setTitle(`Story ${id}`)
          setLoading(false)
        }
      }
    }
    fetchTitle()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="flex items-center justify-between gap-4 border rounded-md p-3">
      <div className="text-sm font-medium">{loading ? 'Loading…' : title}</div>
      <Link
        href={`/details/${encodeURIComponent(id)}`}
        className="text-xs text-cyan-700 hover:underline"
      >
        View
      </Link>
    </div>
  )
}
