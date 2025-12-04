'use client'

import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FaEdit } from 'react-icons/fa'

interface EditButtonProps {
  storyId: string
  authorUsername: string
}

export default function EditButton({ storyId, authorUsername }: EditButtonProps) {
  const { profile, authenticated } = useAuth()
  const router = useRouter()

  if (!authenticated || !profile) {
    return null
  }

  const isOwner = profile.username === authorUsername
  const isAdmin = profile.role === 'ADMIN'
  const canEdit = isOwner || isAdmin

  if (!canEdit) {
    return null
  }

  const handleEdit = () => {
    router.push(`/edit/${storyId}`)
  }

  return (
    <Button onClick={handleEdit} variant="outline" size="sm" className="flex items-center gap-2">
      <FaEdit />
      Edit Post
    </Button>
  )
}
