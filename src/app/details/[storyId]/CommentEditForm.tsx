'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/app/context/AuthContext'
import { updateComment } from '@/app/services/commentAPI'

interface CommentEditFormProps {
  commentId: string | number
  initialText: string
  onCancel: () => void
  onSuccess: () => void
}

export default function CommentEditForm({
  commentId,
  initialText,
  onCancel,
  onSuccess,
}: CommentEditFormProps) {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const [text, setText] = useState(stripHtml(initialText))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError('You must be logged in to edit comments.')
      return
    }

    if (!text.trim()) {
      setError('Comment cannot be empty.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await updateComment(String(commentId), { text: text.trim() }, token)
      router.refresh()
      onSuccess()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to update comment.')
      } else {
        setError('An unknown error occurred.')
      }
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 mb-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Edit your comment..."
        rows={4}
        disabled={saving}
        className="mb-2"
        autoFocus
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving || !text.trim()}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
