'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FaPlus } from 'react-icons/fa'
import { useAuth } from '@/app/context/AuthContext'
import { useEffect, useState } from 'react'
import LoginPrompt from '@/app/components/LoginPrompt'

export function CreatePostButton() {
  const router = useRouter()
  const { profile, authenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleClick = () => {
    if (authenticated && profile) {
      router.push('/story')
    } else {
      setShowLogin(true)
    }
  }

  return (
    <>
      <Button onClick={handleClick} className="gap-2">
        <FaPlus /> Create Post
      </Button>
      <LoginPrompt open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
