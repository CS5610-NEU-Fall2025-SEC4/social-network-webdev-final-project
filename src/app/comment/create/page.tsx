'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createComment, CreateCommentPayload } from '@/app/services/commentAPI'
import { useAuth } from '@/app/context/AuthContext'

export default function CreateCommentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token } = useAuth()

  const [commentText, setCommentText] = useState('')
  const [storyId, setStoryId] = useState<string | null>(null)
  const [parentId, setParentId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const story_id_param = searchParams.get('storyId')
    const parent_id_param = searchParams.get('parentId')

    if (story_id_param) {
      setStoryId(story_id_param)
    }
    if (parent_id_param) {
      setParentId(parent_id_param)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!token) {
      setError('You must be logged in to post a comment.')
      setLoading(false)
      return
    }

    if (!storyId) {
      setError('Story ID is missing. Cannot post comment.')
      setLoading(false)
      return
    }

    if (!commentText.trim()) {
      setError('Comment cannot be empty.')
      setLoading(false)
      return
    }

    const payload: CreateCommentPayload = {
      text: commentText,
      story_id: storyId,
    }

    if (parentId) {
      payload.parent_id = parentId
    }

    try {
      await createComment(payload, token)
      router.push(`/details/post/${storyId}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to post comment.')
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        {parentId ? 'Reply to Comment' : 'Post a Comment'}
      </h1>
      {!storyId && (
        <p className="text-red-500 mb-4">
          Error: Story ID not found in URL. Please navigate from a story page.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">
            Your Comment
          </label>
          <Textarea
            id="commentText"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            rows={5}
            disabled={loading || !storyId}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading || !storyId || !commentText.trim()}>
          {loading ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>
    </div>
  )
}
