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
import { FaTrash } from 'react-icons/fa'
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
        onClick={() => setShowDialog(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <FaTrash />
        Delete
      </Button>

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
