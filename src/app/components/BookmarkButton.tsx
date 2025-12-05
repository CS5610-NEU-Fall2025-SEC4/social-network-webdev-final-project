'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/context/AuthContext'
import { addBookmark, removeBookmark } from '@/app/services/userAPI'

export default function BookmarkButton({
  itemId,
  initiallyBookmarked,
}: {
  type: string
  itemId: string
  initiallyBookmarked: boolean
  title?: string
  url?: string
}) {
  const { token } = useAuth()
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked)
  const [loading, setLoading] = useState(false)

  const toggleBookmark = async () => {
    if (!token) return
    setLoading(true)
    try {
      if (bookmarked) {
        await removeBookmark({ itemId }, token)
        setBookmarked(false)
      } else {
        await addBookmark({ itemId }, token)
        setBookmarked(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={bookmarked ? 'secondary' : 'outline'}
      disabled={loading || !token}
      onClick={toggleBookmark}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  )
}
