'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPublicProfile } from '@/app/services/userAPI'

export default function PublicFollowingAllPage() {
  const params = useParams()
  const id = params?.id as string
  const [following, setFollowing] = useState<Array<{ id: string; username: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        if (!id) return
        const res = await getPublicProfile(id)
        const list = res.following || []
        setFollowing([...list].reverse())
      } catch (e) {
        setError('Failed to load following')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  if (loading) return <div className="p-4">Loading…</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-2 max-w-3xl mx-auto">
        <Link href={`/profile/${id}`} className="text-sm text-gray-700 hover:text-blue-700">
          &lt; Back
        </Link>
      </div>
      <div className="max-w-3xl mx-auto rounded-lg bg-white shadow p-4">
        <h2 className="text-xl font-semibold mb-3">Following</h2>
        <ul className="text-sm space-y-1 max-h-[70vh] overflow-auto">
          {following.length ? (
            following.map((u) => (
              <li key={u.id}>
                <Link href={`/profile/${u.id}`} className="text-cyan-700 hover:underline">
                  @{u.username}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500">Not following anyone yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
