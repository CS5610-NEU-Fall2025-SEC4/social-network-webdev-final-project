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
import { deleteStory } from '@/app/services/postAPI'

interface DeleteButtonProps {
  storyId: string
  authorUsername: string
  title: string
}

export default function DeleteButton({ storyId, authorUsername, title }: DeleteButtonProps) {
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

  const isExternal = !isNaN(Number(storyId))

  const handleDeleteClick = () => {
    if (isExternal) {
      setShowExternalWarning(true)
    } else {
      setShowDialog(true)
    }
  }

  const handleDelete = async () => {
    if (!token) {
      setError('You must be logged in to delete posts.')
      return
    }

    setDeleting(true)
    setError(null)

    try {
      await deleteStory(storyId, token)
      router.push('/home')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to delete post.')
      } else {
        setError('An unknown error occurred.')
      }
      setDeleting(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleDeleteClick}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <FaTrash />
        Delete
      </Button>

      <Dialog open={showExternalWarning} onOpenChange={setShowExternalWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cyan-600">
              <FaExclamationTriangle />
              Cannot Delete External Content
            </DialogTitle>
            <DialogDescription>
              This post cannot be deleted because it is external content from Hacker News.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Why can&apos;t I delete this?</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                This is an external Hacker News post (ID:{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded">{storyId}</code>) that exists
                outside your platform. You can only delete content created directly on your
                platform.
              </p>
            </div>

            <div className="text-sm text-gray-700">
              <p className="font-medium">What you can do:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                <li>Report the post if it violates guidelines</li>
                <li>Hide it from your feed (if available)</li>
                <li>Unlike or unbookmark it</li>
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
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm font-medium text-gray-700">Post Title:</p>
            <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded border">{title}</p>
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
              {deleting ? 'Deleting...' : 'Delete Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
