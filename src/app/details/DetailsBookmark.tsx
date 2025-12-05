'use client'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '@/app/store/profileSlice'
import BookmarkIcon from '@/app/components/BookmarkIcon'

type Props = {
  itemId: string | number
  size?: number
}

export default function DetailsBookmark({ itemId, size = 18 }: Props) {
  const profileState = useSelector(
    (s: unknown) => (s as { profile: StoreProfileState }).profile,
  ) as StoreProfileState
  const bookmarks = useMemo(() => {
    return (profileState as unknown as { bookmarks?: string[] }).bookmarks || []
  }, [profileState])

  const id = String(itemId)
  const initiallyBookmarked = bookmarks.includes(id)

  return <BookmarkIcon itemId={id} initiallyBookmarked={initiallyBookmarked} size={size} />
}
