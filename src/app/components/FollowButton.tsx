'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/app/store'
import { fetchProfile, followUserThunk, unfollowUserThunk } from '@/app/store/profileSlice'

type Props = {
  targetUserId: string
  targetUsername?: string
  className?: string
}

export default function FollowButton({ targetUserId, targetUsername, className }: Props) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [followingLocal, setFollowingLocal] = useState<boolean | null>(null)

  const toggleFollow = async () => {
    if (loading) return
    setLoading(true)
    try {
      if (followingLocal) {
        await dispatch(unfollowUserThunk(targetUserId)).unwrap()
        setFollowingLocal(false)
      } else {
        await dispatch(followUserThunk(targetUserId)).unwrap()
        setFollowingLocal(true)
      }
      try {
        await dispatch(fetchProfile()).unwrap()
      } catch (err) {
        console.error('Follow action failed:', err)
      }
    } catch (e) {
      console.error('Follow toggle failed', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={followingLocal ? 'secondary' : 'default'}
      disabled={loading}
      onClick={toggleFollow}
      className={className}
      aria-pressed={Boolean(followingLocal)}
    >
      {followingLocal ? 'Following' : 'Follow'} {targetUsername ? `@${targetUsername}` : ''}
    </Button>
  )
}
