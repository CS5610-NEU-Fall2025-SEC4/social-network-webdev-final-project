'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/app/store'
import { fetchProfile, followUserThunk, unfollowUserThunk } from '@/app/store/profileSlice'
import { isFollowing } from '@/app/services/userAPI'
import { useAuth } from '@/app/context/AuthContext'

type Props = {
  targetUserId: string
  targetUsername?: string
  className?: string
}

export default function FollowButton({ targetUserId, targetUsername, className }: Props) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [followingLocal, setFollowingLocal] = useState<boolean>(false)
  const { token, profile } = useAuth()
  const [hydrating, setHydrating] = useState<boolean>(false)

  const initialDerived = useMemo(() => {
    if (!profile) return false
    return (profile.following ?? []).some(
      (u: { id: string; username: string }) => u.id === targetUserId,
    )
  }, [profile, targetUserId])

  useEffect(() => {
    setFollowingLocal(initialDerived)
  }, [initialDerived])

  useEffect(() => {
    const hydrate = async () => {
      if (!token) return
      try {
        setHydrating(true)
        const following = await isFollowing(targetUserId, token)
        setFollowingLocal(following)
      } catch (err) {
        console.error('Failed to check following status:', err)
      } finally {
        setHydrating(false)
      }
    }
    if (!initialDerived) {
      void hydrate()
    }
  }, [token, targetUserId, initialDerived])

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
    } catch (err) {
      console.error('Follow toggle failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={followingLocal ? 'secondary' : 'default'}
      disabled={loading || hydrating}
      onClick={toggleFollow}
      className={className}
      aria-pressed={Boolean(followingLocal)}
    >
      {hydrating ? 'Checking…' : followingLocal ? 'Following' : 'Follow'}{' '}
      {targetUsername ? `@${targetUsername}` : ''}
    </Button>
  )
}
