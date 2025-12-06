'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPublicProfile } from '@/app/services/userAPI'
import FollowButton from '@/app/components/FollowButton'
import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'
import FollowList from '../components/FollowList'

export default function PublicProfilePage() {
  const params = useParams()
  const id = params?.id as string
  const { profile } = useAuth()
  const [data, setData] = useState<Awaited<ReturnType<typeof getPublicProfile>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        if (!id) return
        const res = await getPublicProfile(id)
        setData(res)
      } catch (e) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const isSelf = useMemo(() => profile?.id === id, [profile?.id, id])
  const initiallyFollowing = useMemo(() => {
    if (!profile || !data) return false
    return (profile.following ?? []).some((u: { id: string; username: string }) => u.id === data.id)
  }, [profile, data])

  if (loading)
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse max-w-5xl mx-auto">
          <div className="h-24 bg-gray-200 rounded-xl mb-4" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 grid gap-4">
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
            <div className="grid gap-4">
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!data) return null

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-2 max-w-5xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-700 !no-underline text-sm"
        >
          &lt; Back
        </Link>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-black to-cyan-700 p-6 text-white shadow-md mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/50 backdrop-blur flex items-center justify-center text-2xl font-semibold">
              {(data.firstName?.[0] || '') + (data.lastName?.[0] || data.username?.[0] || 'U')}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                {data.firstName || data.lastName
                  ? `${data.firstName || ''} ${data.lastName || ''}`.trim()
                  : 'Name Hidden'}
              </h1>
              <p className="text-white/80 mb-1">@{data.username}</p>
              {data.createdAt ? (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
                  Member since {new Date(String(data.createdAt)).toLocaleDateString()}
                </span>
              ) : (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-white/15 text-white/60 backdrop-blur-sm">
                  Joined date hidden
                </span>
              )}
            </div>
            {!isSelf && <FollowButton targetUserId={data.id} targetUsername={data.username} />}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 grid gap-4">
            <div className="rounded-lg bg-white shadow p-4">
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {data.bio === null || data.bio === undefined
                  ? 'Bio hidden.'
                  : data.bio || 'No bio yet.'}
              </p>
            </div>
            <div className="rounded-lg bg-white shadow p-4">
              <h3 className="text-lg font-medium mb-2">Contact</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>
                  <span className="font-medium">Website:</span>{' '}
                  {data.website === null || data.website === undefined
                    ? 'Website hidden'
                    : data.website || 'Not provided'}
                </li>
                <li>
                  <span className="font-medium">Location:</span>{' '}
                  {data.location === null || data.location === undefined
                    ? 'Location hidden'
                    : data.location || 'Not provided'}
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-white shadow p-4">
              <h3 className="text-lg font-medium mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {(data.interests || []).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-cyan-50 text-cyan-700 rounded">
                    {tag}
                  </span>
                ))}
                {!data.interests?.length && (
                  <p className="text-gray-500 text-sm">
                    {data.interests === undefined ? 'Interests hidden.' : 'No interests listed.'}
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-lg bg-white shadow p-4">
              <h3 className="text-lg font-medium mb-2">Social</h3>
              <ul className="text-sm text-cyan-700 space-y-1">
                {data.social && data.social.twitter && (
                  <li>
                    <a
                      href={data.social.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      Twitter
                    </a>
                  </li>
                )}
                {data.social && data.social.github && (
                  <li>
                    <a
                      href={data.social.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      GitHub
                    </a>
                  </li>
                )}
                {data.social && data.social.linkedin && (
                  <li>
                    <a
                      href={data.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      LinkedIn
                    </a>
                  </li>
                )}
                {(!data.social ||
                  (!data.social.twitter && !data.social.github && !data.social.linkedin)) && (
                  <li className="text-gray-500">
                    {data.social === undefined
                      ? 'Social links hidden.'
                      : 'No social links added yet.'}
                  </li>
                )}
              </ul>
            </div>
            <div className="rounded-lg bg-white shadow p-4">
              <h3 className="text-lg font-medium mb-2">Stats</h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-gray-500">Followers</dt>
                  <dd className="font-semibold">{(data.followers || []).length}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Following</dt>
                  <dd className="font-semibold">{(data.following || []).length}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Posts</dt>
                  <dd className="font-semibold">0</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Comments</dt>
                  <dd className="font-semibold">0</dd>
                </div>
                <div className="col-span-2 text-xs text-gray-400">More stats coming soon.</div>
              </dl>
            </div>
          </div>
          <div className="grid gap-4">
            <FollowList
              title="Following"
              items={data.following || []}
              emptyMessage="Not following anyone yet."
              seeAllHref={
                data.following && data.following.length > 8
                  ? `/profile/${data.id}/following`
                  : undefined
              }
              limit={8}
            />
            <FollowList
              title="Followers"
              items={data.followers || []}
              emptyMessage="No followers yet."
              seeAllHref={
                data.followers && data.followers.length > 8
                  ? `/profile/${data.id}/followers`
                  : undefined
              }
              limit={8}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
