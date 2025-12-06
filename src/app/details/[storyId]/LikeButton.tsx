'use client'

import { useState, useEffect } from 'react'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/context/AuthContext'
import { toggleLike, getLikeStatus } from '@/app/services/likesAPI'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const status = await getLikeStatus(
          String(itemId),
          itemType,
          profile?.username,
          initialPoints,
        )
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
  }, [itemId, itemType, profile?.username, initialPoints, onPointsUpdate])

  const handleLikeClick = async () => {
    if (!token || !profile) {
      router.push('/logIn')
      return
    }

    setLoading(true)
    try {
      const result = await toggleLike(String(itemId), itemType, token, initialPoints)
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
    <Button variant="ghost" onClick={handleLikeClick} disabled={loading} className="gap-2">
      {isLiked ? (
        <span>
          <BiSolidLike className="text-blue-600" /> Like
        </span>
      ) : (
        <span>
          <BiLike /> Like
        </span>
      )}
    </Button>
  )
}
