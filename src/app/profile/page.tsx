'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import UserDetails from '../details/user'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '../store/profileSlice'
import { fetchProfile } from '../store/profileSlice'

type EditableUser = {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  bio?: string
  karma?: number
  joined?: string
  location?: string
  website?: string
  interests?: string[]
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
  visibility?: {
    name?: boolean
    bio?: boolean
    location?: boolean
    website?: boolean
    interests?: boolean
    social?: boolean
  }
  stats?: {
    posts?: number
    comments?: number
    upvotesGiven?: number
    upvotesReceived?: number
    followers?: number
    following?: number
  }
  followers?: Array<{ id: string; username: string }>
  following?: Array<{ id: string; username: string }>
  bookmarks?: string[]
}

export default function ProfilePage() {
  const { loading, authenticated } = useRequireAuth()
  const dispatch = useAppDispatch()
  const profileState = useSelector(
    (s: unknown) => (s as { profile: StoreProfileState }).profile,
  ) as StoreProfileState

  const [tab, setTab] = useState<'overview' | 'edit'>('overview')
  const [user, setUser] = useState<EditableUser | null>(null)

  useEffect(() => {
    if (!loading && authenticated && profileState.status === 'idle') {
      void dispatch(fetchProfile())
    }
  }, [loading, authenticated, profileState.status, dispatch])

  useEffect(() => {
    const profile = profileState.id ? profileState : null
    if (profile) {
      const editable: EditableUser = {
        id: profile.id!,
        username: profile.username!,
        firstName: profile.firstName!,
        lastName: profile.lastName!,
        email: profile.email!,
        bio: profile.bio ?? undefined,
        location: profile.location ?? undefined,
        website: profile.website ?? undefined,
        interests: profile.interests || [],
        social: profile.social || {},
        visibility: profile.visibility || {},
        stats: {},
        followers: profile.followers || [],
        following: profile.following || [],
        bookmarks: (profile as unknown as { bookmarks?: string[] }).bookmarks ?? [],
        joined: profile.createdAt ? String(profile.createdAt) : undefined,
      }
      setUser(editable)
    }
  }, [profileState])

  const initials = useMemo(() => {
    if (!user) return 'U'
    const a = user.firstName?.[0] || ''
    const b = user.lastName?.[0] || ''
    return (a + b || user.username?.[0] || 'U').toUpperCase()
  }, [user])

  const stats = useMemo(() => {
    const followers = (user?.followers || []).length
    const following = (user?.following || []).length
    const bookmarks = (user?.bookmarks || []).length
    return {
      posts: user?.stats?.posts ?? 0,
      comments: user?.stats?.comments ?? 0,
      upvotesGiven: user?.stats?.upvotesGiven ?? 0,
      upvotesReceived: user?.stats?.upvotesReceived ?? 0,
      followers,
      following,
      bookmarks,
    }
  }, [user])

  if (loading || !authenticated) {
    return null
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-2 max-w-5xl mx-auto">
        <Link
          href="/home"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-blue-700 !no-underline text-sm"
        >
          &lt; Back
        </Link>
      </div>
      <div className="max-w-5xl mx-auto">
        {profileState.status === 'failed' && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
            <span>{profileState.error || 'Failed to load profile.'}</span>
            <button
              onClick={() => dispatch(fetchProfile())}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-black to-cyan-700 p-6 text-white shadow-md mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/50 backdrop-blur flex items-center justify-center text-2xl font-semibold">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-semibold leading-tight">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-white/80 mb-1">@{user?.username}</p>
              {user?.joined && (
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
                  Member since {new Date(user.joined).toLocaleDateString()}
                </span>
              )}
            </div>
            {user?.id && (
              <Link
                href={`/profile/${encodeURIComponent(user.id)}`}
                className="px-3 py-2 border border-white/70 text-white hover:bg-white/10 rounded-md text-sm"
              >
                View public profile
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-4">
          <button
            className={`px-3 py-2 text-sm rounded-t ${
              tab === 'overview'
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setTab('overview')}
          >
            Overview
          </button>
          <Link
            href="/edit"
            className={`px-3 py-2 text-sm rounded-t ${
              tab === 'edit'
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Edit Profile
          </Link>
        </div>

        {tab === 'overview' && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 grid gap-4">
              <div className="rounded-lg bg-white shadow p-4">
                {user && (
                  <UserDetails
                    username={user.username}
                    id={user.id}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                  />
                )}
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-700 whitespace-pre-line">{user?.bio || 'No bio yet.'}</p>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Contact</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>
                    <span className="font-medium">Email:</span>{' '}
                    {user?.email ? (
                      <a href={`mailto:${user.email}`} className="text-cyan-700 hover:underline">
                        {user.email}
                      </a>
                    ) : (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </li>
                  <li>
                    <span className="font-medium">Website:</span>{' '}
                    {user?.website ? (
                      <a
                        href={
                          user.website.startsWith('http') ? user.website : `https://${user.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-700 hover:underline"
                      >
                        {user.website}
                      </a>
                    ) : (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </li>
                  <li>
                    <span className="font-medium">Location:</span>{' '}
                    {user?.location ? (
                      <span>{user.location}</span>
                    ) : (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {(user?.interests || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {!user?.interests?.length && (
                    <p className="text-gray-500 text-sm">No interests added yet.</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Social</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  {user?.social?.twitter && (
                    <li>
                      <a
                        href={user.social.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        Twitter
                      </a>
                    </li>
                  )}
                  {user?.social?.github && (
                    <li>
                      <a
                        href={user.social.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        GitHub
                      </a>
                    </li>
                  )}
                  {user?.social?.linkedin && (
                    <li>
                      <a
                        href={user.social.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        LinkedIn
                      </a>
                    </li>
                  )}
                  {!user?.social?.twitter && !user?.social?.github && !user?.social?.linkedin && (
                    <li className="text-gray-500">No social links added yet.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Bookmarks</h3>
                <div className="space-y-2">
                  {user?.bookmarks && user.bookmarks.length > 0 ? (
                    user.bookmarks.map((id) => (
                      <div
                        key={id}
                        className="flex items-center justify-between gap-4 border rounded-md p-3"
                      >
                        <div className="text-sm font-medium">Story {id}</div>
                        <Link
                          href={`/details/${encodeURIComponent(id)}`}
                          className="text-xs text-cyan-700 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No bookmarks yet.</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-3">Stats</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Posts</dt>
                    <dd className="font-semibold">{stats.posts}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Comments</dt>
                    <dd className="font-semibold">{stats.comments}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Upvotes given</dt>
                    <dd className="font-semibold">{stats.upvotesGiven}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Upvotes received</dt>
                    <dd className="font-semibold">{stats.upvotesReceived}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Followers</dt>
                    <dd className="font-semibold">{stats.followers}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Following</dt>
                    <dd className="font-semibold">{stats.following}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Bookmarks</dt>
                    <dd className="font-semibold">{stats.bookmarks}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Karma</dt>
                    <dd className="font-semibold">{user?.karma ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Joined</dt>
                    <dd className="font-semibold">
                      {user?.joined ? new Date(user.joined).toLocaleDateString() : '—'}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Following</h3>
                <ul className="text-sm space-y-1">
                  {(user?.following || []).map((u: { id: string; username: string }) => (
                    <li key={u.id}>
                      <Link href={`/profile/${u.id}`} className="text-blue-700 hover:underline">
                        @{u.username}
                      </Link>
                    </li>
                  ))}
                  {!user?.following?.length && (
                    <li className="text-gray-500">Not following anyone yet.</li>
                  )}
                </ul>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Followers</h3>
                <ul className="text-sm space-y-1">
                  {(user?.followers || []).map((u: { id: string; username: string }) => (
                    <li key={u.id}>
                      <Link href={`/profile/${u.id}`} className="text-cyan-700 hover:underline">
                        @{u.username}
                      </Link>
                    </li>
                  ))}
                  {!user?.followers?.length && <li className="text-gray-500">No followers yet.</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
