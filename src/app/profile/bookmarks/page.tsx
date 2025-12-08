'use client'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '@/app/store/profileSlice'
import BookmarkTitle from '../BookmarkTitle'

export default function AllBookmarksPage() {
  const profileState = useSelector(
    (s: unknown) => (s as { profile: StoreProfileState }).profile,
  ) as StoreProfileState

  const bookmarks = (profileState as unknown as { bookmarks?: string[] }).bookmarks || []
  const ordered = [...bookmarks].reverse()

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-2 max-w-3xl mx-auto">
        <Link href="/profile" className="text-sm text-gray-700 hover:text-cyan-700">
          &lt; Back
        </Link>
      </div>
      <div className="max-w-3xl mx-auto rounded-lg bg-white shadow p-4">
        <h2 className="text-xl font-semibold mb-3">All Bookmarks</h2>
        <div
          className="space-y-2 max-h-[70vh] overflow-auto pr-2 md:pr-3"
          style={{ scrollbarGutter: 'stable' }}
        >
          {ordered.length ? (
            ordered.map((id) => <BookmarkTitle key={id} id={id} />)
          ) : (
            <p className="text-sm text-gray-600">No bookmarks yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
