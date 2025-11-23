'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FaPlus } from 'react-icons/fa'
import { useAuth } from '@/app/context/AuthContext'
import { useEffect, useState } from 'react'

export function CreatePostButton() {
  const router = useRouter()
  const { profile, authenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!authenticated || !profile) return null

  return (
    <Button onClick={() => router.push('/story')} className="gap-2">
      <FaPlus /> Create Post
    </Button>
  )
}
