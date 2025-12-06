'use client'

import { useState } from 'react'
import LoginPrompt from './LoginPrompt'
import { useAuth } from '@/app/context/AuthContext'
import { addBookmark, removeBookmark } from '@/app/services/userAPI'
import { useAppDispatch } from '@/app/store'
import { fetchProfile } from '@/app/store/profileSlice'

type Props = {
  itemId: string | number
  initiallyBookmarked: boolean
  size?: number
}

export default function BookmarkIcon({ itemId, initiallyBookmarked, size = 18 }: Props) {
  const { token } = useAuth()
  const dispatch = useAppDispatch()
  const [bookmarked, setBookmarked] = useState<boolean>(initiallyBookmarked)
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const color = bookmarked ? '#0e7490' : '#6b7280'
  const normalizedId = String(itemId)

  const toggle = async () => {
    if (!token) {
      setShowLogin(true)
      return
    }
    if (loading) return
    setLoading(true)
    try {
      if (bookmarked) {
        await removeBookmark({ itemId: normalizedId }, token)
        setBookmarked(false)
      } else {
        await addBookmark({ itemId: normalizedId }, token)
        setBookmarked(true)
      }
      try {
        await dispatch(fetchProfile()).unwrap()
      } catch (err) {
        console.error('Bookmark action failed:', err)
      }
    } catch (e) {
      console.error('Bookmark toggle failed', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        title={bookmarked ? 'Bookmarked' : 'Bookmark'}
        onClick={toggle}
        disabled={loading}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={bookmarked ? color : 'none'}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      <LoginPrompt open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
