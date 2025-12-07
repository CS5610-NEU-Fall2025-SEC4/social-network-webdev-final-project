'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa'
import { deleteComment } from '@/app/services/commentAPI'

interface DeleteCommentButtonProps {
  commentId: string | number
  authorUsername: string
  commentText: string
}

export default function DeleteCommentButton({
  commentId,
  authorUsername,
  commentText,
}: DeleteCommentButtonProps) {
  const { profile, authenticated, token } = useAuth()
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [showExternalWarning, setShowExternalWarning] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!authenticated || !profile) {
    return null
  }

  const isOwner = profile.username === authorUsername
  const isAdmin = profile.role === 'ADMIN'
  const canDelete = isOwner || isAdmin

  if (!canDelete) {
    return null
  }

  const isExternal = !isNaN(Number(commentId))

  const handleDeleteClick = () => {
    if (isExternal) {
      setShowExternalWarning(true)
    } else {
      setShowDialog(true)
    }
  }

  const handleDelete = async () => {
    if (!token) {
      setError('You must be logged in to delete comments.')
      return
    }

    setDeleting(true)
    setError(null)

    try {
      await deleteComment(String(commentId), token)
      setShowDialog(false)
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to delete comment.')
      } else {
        setError('An unknown error occurred.')
      }
      setDeleting(false)
    }
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const previewText = stripHtml(commentText).slice(0, 100)

  return (
    <>
      <Button
        onClick={handleDeleteClick}
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-gray-600 hover:text-red-600"
      >
        <FaTrash />
        Delete
      </Button>

      <Dialog open={showExternalWarning} onOpenChange={setShowExternalWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cyan-600">
              <FaExclamationTriangle />
              Cannot Delete External Comment
            </DialogTitle>
            <DialogDescription>
              This comment cannot be deleted because it is external content from Hacker News.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Why can&apos;t I delete this?</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                This is an external Hacker News comment (ID:{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded">{commentId}</code>) that exists
                outside your platform. You can only delete comments created directly on your
                platform.
              </p>
            </div>

            <div className="text-sm text-gray-700">
              <p className="font-medium">What you can do:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                <li>Report the comment if it violates guidelines</li>
                <li>Reply with your perspective</li>
                <li>Unlike it if you previously liked it</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExternalWarning(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm font-medium text-gray-700">Comment:</p>
            <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded border">
              {previewText}
              {previewText.length >= 100 && '...'}
            </p>
            {isAdmin && (
              <p className="text-xs text-cyan-600 mt-2">
                Note: If this comment has replies, it will be soft-deleted and marked as [deleted by
                admin]
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
