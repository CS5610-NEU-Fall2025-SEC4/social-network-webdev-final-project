'use client'
import { HNStory } from '@/app/types/types'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UsernameLink from '@/app/components/username-link'
import BookmarkClient from './BookmarkClient'
import { useEffect, useState } from 'react'
import { FaUser, FaStar } from 'react-icons/fa'
import { FaRegClock } from 'react-icons/fa6'

export default function StoryComponent({ story }: { story: HNStory }) {
  const [likeCount, setLikeCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const isComment = story._tags?.includes('comment') || story.type === 'comment'

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const secondsAgo = Math.floor((now - timestamp * 1000) / 1000)

    if (secondsAgo < 60) return 'just now'
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`
    if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 86400)} days ago`
    if (secondsAgo < 31536000) return `${Math.floor(secondsAgo / 2592000)} months ago`
    return `${Math.floor(secondsAgo / 31536000)} years ago`
  }

  const isLocalStory = isNaN(Number(story.story_id))

  const itemId: string = String(
    isLocalStory ? (story.story_id ?? story.objectID) : (story.objectID ?? story.story_id),
  )
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
        const response = await fetch(`${base}/likes/${itemId}/status`)
        if (response.ok) {
          const data = await response.json()
          setLikeCount(data.totalPoints || 0)
        } else {
          setLikeCount(0)
        }
      } catch (error) {
        console.error('Error fetching like count:', error)
        setLikeCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchLikeCount()
  }, [itemId])

  return (
    <Card className="shadow-sm mb-4 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-semibold">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {isComment ? (
                <div
                  dangerouslySetInnerHTML={{ __html: story.comment_text ?? '' }}
                  className="text-gray-800"
                />
              ) : (
                <Link
                  href={`/details/${itemId}`}
                  className="text-gray-800 hover:text-cyan-600 hover:underline transition-colors"
                >
                  {story.title}
                </Link>
              )}
            </div>

            <div className="flex-shrink-0">
              <BookmarkClient itemId={itemId} />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaStar className="shrink-0" />
            <span className="font-semibold">{loading ? '...' : likeCount}</span>
            <span>points</span>
          </div>

          <div className="flex items-center gap-1">
            <FaUser className="shrink-0" />
            <span>by</span>
            <UsernameLink username={story.author} />
          </div>

          <div className="flex items-center gap-1">
            <FaRegClock className="shrink-0" />
            <span>{getRelativeTime(story.created_at_i)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
