'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'
import { FaClock, FaCommentAlt, FaStar, FaPlus } from 'react-icons/fa'
import { HNStory } from '../types/types'

export default function CustomContent() {
  const { profile } = useAuth()
  const username = profile?.username
  const [stories, setStories] = useState<HNStory[]>([])
  const [loading, setLoading] = useState(true)

  console.log('🔍 CustomContent - username:', username)

  useEffect(() => {
    const fetchUserStories = async () => {
      if (!username) {
        console.log('❌ No username, skipping fetch')
        setLoading(false)
        return
      }

      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const url = `${API_BASE}/story/author/${username}?limit=10`
        console.log('📡 Fetching from:', url)

        const response = await fetch(url)
        console.log('📡 Response status:', response.status, response.ok)

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Fetched stories:', data)
          console.log('📊 Number of stories:', data.length)

          // Log first story details
          if (data.length > 0) {
            console.log('📝 First story:', {
              story_id: data[0].story_id,
              title: data[0].title,
              author: data[0].author,
            })
          }

          setStories(data)
        } else {
          console.error('❌ Fetch failed with status:', response.status)
          setStories([])
        }
      } catch (error) {
        console.error('❌ Error fetching stories:', error)
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
    console.log('⏳ Loading...')
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (stories.length === 0) {
    console.log('📭 No stories found')
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <FaPlus className="text-orange-500 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
        <p className="text-gray-600 mb-4">Start sharing with the community!</p>
        <Link href="/story">
          <button className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
            Create Your First Post
          </button>
        </Link>
      </div>
    )
  }

  console.log('📋 Rendering stories:', stories.length)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Recent Posts ({stories.length})</h3>
      {stories.map((story, index) => {
        console.log(
          `🔗 Story ${index} - story_id:`,
          story.story_id,
          'Link:',
          `/details/${story.story_id}`,
        )

        return (
          <div key={story.story_id} className="bg-white border rounded-lg p-4 hover:shadow-md">
            <Link
              href={`/details/${story.story_id}`}
              className="text-lg font-semibold hover:text-orange-500"
              onClick={() => console.log('🖱️ Clicked story:', story.story_id, story.title)}
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
        )
      })}
    </div>
  )
}
