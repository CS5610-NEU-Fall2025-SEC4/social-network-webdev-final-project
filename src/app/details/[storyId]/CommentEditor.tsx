'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCommentAlt, FaRegCommentAlt } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/app/context/AuthContext'
import LoginPrompt from '@/app/components/LoginPrompt'

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
  const [showLogin, setShowLogin] = useState(false)
  const { token, profile } = useAuth()
  const router = useRouter()

  const handleCommentClick = () => {
    if (!token || !profile) {
      setShowLogin(true)
      return
    }
    setIsEditorOpen(!isEditorOpen)
  }

  const handleSubmit = async () => {
    if (!token || !profile) {
      setShowLogin(true)
      return
    }

    if (!commentText.trim()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      const payload: { text: string; story_id: string; parent_id?: string } = {
        text: commentText,
        story_id: String(storyId),
      }

      if (parentId) {
        payload.parent_id = String(parentId)
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

  return (
    <>
      <Button variant="ghost" onClick={handleCommentClick} className="gap-2">
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
      <LoginPrompt open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
