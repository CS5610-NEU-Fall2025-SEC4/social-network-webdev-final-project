'use client'
import Link from 'next/link'

export type FollowUser = { id: string; username: string }

type Props = {
  title: string
  items: FollowUser[]
  emptyMessage: string
  seeAllHref?: string
  limit?: number
  linkClassName?: string
}

export default function FollowList({
  title,
  items,
  emptyMessage,
  seeAllHref,
  limit = 8,
  linkClassName = 'text-cyan-700 hover:underline',
}: Props) {
  const visible = [...items].reverse().slice(0, limit)
  return (
    <div className="rounded-lg bg-white shadow p-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <ul className="text-sm space-y-1 max-h-96 overflow-auto">
        {visible.length ? (
          visible.map((u) => (
            <li key={u.id}>
              <Link href={`/profile/${u.id}`} className={linkClassName}>
                @{u.username}
              </Link>
            </li>
          ))
        ) : (
          <li className="text-gray-500">{emptyMessage}</li>
        )}
      </ul>
      {items.length > limit && seeAllHref && (
        <div className="mt-3 flex justify-end">
          <Link href={seeAllHref} className="text-xs text-cyan-700 hover:underline">
            See all
          </Link>
        </div>
      )}
    </div>
  )
}
