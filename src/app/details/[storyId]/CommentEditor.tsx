'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCommentAlt, FaRegCommentAlt } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/app/context/AuthContext'

interface CommentEditorProps {
  comment: string
  storyId: string
  parentId?: string | number
}

export default function CommentEditor({ comment, storyId, parentId }: CommentEditorProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, profile } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!token || !profile) {
      setError('You must be logged in to comment')
      return
    }

    if (!commentText.trim()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      const payload: { text: string; story_id: string; parent_id?: string | number } = {
        text: commentText,
        story_id: storyId,
      }

      if (parentId) {
        payload.parent_id = parentId
      }
      const response = await fetch(`${base}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to create comment')
      }

      setCommentText('')
      setIsEditorOpen(false)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create comment')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setCommentText('')
    setError(null)
    setIsEditorOpen(false)
  }

  if (!profile) {
    return (
      <Button variant="ghost" onClick={() => router.push('/logIn')} className="gap-2">
        <FaRegCommentAlt />
        Log in to comment
      </Button>
    )
  }

  return (
    <div>
      <Button variant="ghost" onClick={() => setIsEditorOpen(!isEditorOpen)} className="gap-2">
        {isEditorOpen ? <FaCommentAlt /> : <FaRegCommentAlt />}
        {comment}
      </Button>

      {isEditorOpen && (
        <Card className="p-4 min-w-2xl mt-2">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add a comment</label>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts?"
              className="min-h-[120px]"
              autoFocus
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!commentText.trim() || loading}>
              {loading ? 'Submitting...' : 'Submit Comment'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
