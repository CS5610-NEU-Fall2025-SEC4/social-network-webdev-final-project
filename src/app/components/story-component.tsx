'use client'
import { HNStory } from '@/app/types/types'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UsernameLink from '@/app/components/username-link'
import BookmarkClient from './BookmarkClient'
import { useEffect, useState } from 'react'

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
      <CardHeader>
        <CardTitle className="mb-2 text-lg font-semibold">
          {isComment ? (
            <div
              dangerouslySetInnerHTML={{ __html: story.comment_text ?? '' }}
              className="text-gray-800"
            />
          ) : (
            <Link href={`/details/${itemId}`} className="text-gray-800 hover:underline">
              {story.title}
            </Link>
          )}

          {isComment && (
            <div className="mt-2">
              <BookmarkClient itemId={itemId} />
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div>
            <span className="font-bold">{loading ? '...' : likeCount}</span> points
          </div>
          <span>•</span>
          <div>
            by <UsernameLink username={story.author} />
          </div>
          <span>•</span>
          <div>{getRelativeTime(story.created_at_i)}</div>
          {!isComment && (
            <>
              <span>•</span>
              <div className="flex items-center">
                <BookmarkClient itemId={itemId} />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
