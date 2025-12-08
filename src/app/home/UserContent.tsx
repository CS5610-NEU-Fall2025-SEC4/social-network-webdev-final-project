'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaClock, FaCommentAlt, FaStar } from 'react-icons/fa'
import { HNStory } from '@/app/types/types'

interface UserContentProps {
  username: string
}

export default function UserContent({ username }: UserContentProps) {
  const [stories, setStories] = useState<HNStory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStories = async () => {
      if (!username) {
        setLoading(false)
        return
      }

      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const url = `${API_BASE}/story/author/${username}?limit=10`

        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          setStories(data)
        } else {
          setStories([])
        }
      } catch (error) {
        console.error('Error fetching stories:', error)
        setStories([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserStories()
  }, [username])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Posts</h3>
        <p className="text-gray-500 text-sm">No posts yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Posts ({stories.length})</h3>
      {stories.map((story) => (
        <div key={story.story_id} className="bg-white border rounded-lg p-4 hover:shadow-md">
          <Link
            href={`/details/${story.story_id}`}
            className="text-lg font-semibold hover:text-orange-500"
          >
            {story.title}
          </Link>
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>
              <FaStar className="inline" /> {story.points}
            </span>
            <span>
              <FaCommentAlt className="inline" /> {story.commentCount || 0}
            </span>
            <span>
              <FaClock className="inline" /> {formatDate(story.created_at_i)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
