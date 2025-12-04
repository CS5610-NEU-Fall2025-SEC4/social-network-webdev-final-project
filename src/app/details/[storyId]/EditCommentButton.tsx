'use client'

import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import { FaEdit } from 'react-icons/fa'

interface EditCommentButtonProps {
  authorUsername: string
  onEditClick: () => void
}

export default function EditCommentButton({ authorUsername, onEditClick }: EditCommentButtonProps) {
  const { profile, authenticated } = useAuth()

  if (!authenticated || !profile) {
    return null
  }

  const isOwner = profile.username === authorUsername

  if (!isOwner) {
    return null
  }

  return (
    <Button
      onClick={onEditClick}
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
    >
      <FaEdit />
      Edit
    </Button>
  )
}
