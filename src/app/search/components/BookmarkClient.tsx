'use client'

import BookmarkIcon from '@/app/components/BookmarkIcon'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '@/app/store/profileSlice'
import { useAuth } from '@/app/context/AuthContext'
import type { Profile } from '@/app/services/userAPI'

type Props = {
  itemId: string
}

export default function BookmarkClient({ itemId }: Props) {
  const { profile } = useAuth()

  const profileState = useSelector(
    (s: unknown) => (s as { profile: StoreProfileState }).profile,
  ) as StoreProfileState

  const reduxBookmarks = (profileState as unknown as { bookmarks?: string[] }).bookmarks || []

  const initiallyBookmarked =
    ((profile as Partial<Profile>)?.bookmarks ?? []).includes(itemId) ||
    reduxBookmarks.includes(itemId)

  return <BookmarkIcon itemId={itemId} initiallyBookmarked={initiallyBookmarked} />
}
