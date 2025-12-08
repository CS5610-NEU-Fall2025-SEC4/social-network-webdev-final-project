'use client'

import { useState, useEffect } from 'react'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/context/AuthContext'
import { toggleLike, getLikeStatus } from '@/app/services/likesAPI'
import { useRouter } from 'next/navigation'
import LoginPrompt from '@/app/components/LoginPrompt'

interface LikeButtonProps {
  itemId: string | number
  itemType: 'story' | 'comment'
  initialPoints?: number
  onPointsUpdate?: (newPoints: number) => void
}

export default function LikeButton({
  itemId,
  itemType,
  initialPoints = 0,
  onPointsUpdate,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const { token, profile } = useAuth()
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const status = await getLikeStatus(String(itemId), profile?.username)
        setIsLiked(status.isLiked)

        if (onPointsUpdate) {
          onPointsUpdate(status.totalPoints)
        }
      } catch (error) {
        console.error('Error fetching like status:', error)
      }
    }

    if (profile?.username) {
      fetchLikeStatus()
    }
  }, [itemId, profile?.username, onPointsUpdate])

  const handleLikeClick = async () => {
    if (!token || !profile) {
      setShowLogin(true)
      return
    }

    setLoading(true)
    try {
      const result = await toggleLike(String(itemId), token)
      setIsLiked(result.liked)

      if (onPointsUpdate) {
        onPointsUpdate(result.totalPoints)
      }
      router.refresh()
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={handleLikeClick} disabled={loading} className="gap-2">
        {isLiked ? (
          <span className="flex items-center gap-1">
            <BiSolidLike className="text-blue-600" />
            <span>Like</span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <BiLike />
            <span>Like</span>
          </span>
        )}
      </Button>
      <LoginPrompt open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
