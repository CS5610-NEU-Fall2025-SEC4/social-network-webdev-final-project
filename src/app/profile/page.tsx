'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import UserDetails from '../details/user'
import { useAuth } from '../context/AuthContext'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '../store/profileSlice'
import { fetchProfile, updateProfileThunk } from '../store/profileSlice'

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
}

export default function ProfilePage() {
  const { loading, authenticated } = useAuth()
  const dispatch = useAppDispatch()
  const profileState = useSelector(
    (s: unknown) => (s as { profile: StoreProfileState }).profile,
  ) as StoreProfileState

  const [tab, setTab] = useState<'overview' | 'edit'>('overview')
  const [user, setUser] = useState<EditableUser | null>(null)
  const [form, setForm] = useState<EditableUser | null>(null)
  const [message, setMessage] = useState<string>('')

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
        stats: {},
        followers: profile.followers || [],
        following: profile.following || [],
      }
      setUser(editable)
      setForm(editable)
    }
  }, [profileState])

  const initials = useMemo(() => {
    if (!user) return 'U'
    const a = user.firstName?.[0] || ''
    const b = user.lastName?.[0] || ''
    return (a + b || user.username?.[0] || 'U').toUpperCase()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return
    const { name, value } = e.target
    setForm({ ...form, [name]: value } as EditableUser)
    setMessage('')
  }

  const handleSave = async () => {
    if (!form) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMessage('Please enter a valid email address.')
      return
    }
    try {
      await dispatch(
        updateProfileThunk({
          username: form.username,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          bio: form.bio,
          location: form.location,
          website: form.website,
          interests: form.interests || [],
          twitter: form.social?.twitter,
          github: form.social?.github,
          linkedin: form.social?.linkedin,
        }),
      ).unwrap()
      setMessage('Profile updated successfully.')
      setTab('overview')
    } catch {
      setMessage('Failed to update profile.')
    }
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
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white shadow-md mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 ring-2 ring-white/50 backdrop-blur flex items-center justify-center text-2xl font-semibold">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-semibold leading-tight">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-white/80">@{user?.username}</p>
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
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => {
              setMessage('')
              setTab('overview')
            }}
          >
            Overview
          </button>
          <button
            className={`px-3 py-2 text-sm rounded-t ${
              tab === 'edit'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => {
              setMessage('')
              setTab('edit')
            }}
          >
            Edit Profile
          </button>
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
                    <span className="font-medium">Email:</span> {user?.email}
                  </li>
                  <li>
                    <span className="font-medium">Website:</span> {user?.website || '—'}
                  </li>
                  <li>
                    <span className="font-medium">Location:</span> {user?.location || '—'}
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-white shadow p-4">
                <h3 className="text-lg font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {(user?.interests || []).map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-blue-50 text-blue-800 rounded">
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
                <h3 className="text-lg font-medium mb-3">Stats</h3>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Posts</dt>
                    <dd className="font-semibold">{user?.stats?.posts ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Comments</dt>
                    <dd className="font-semibold">{user?.stats?.comments ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Upvotes given</dt>
                    <dd className="font-semibold">{user?.stats?.upvotesGiven ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Upvotes received</dt>
                    <dd className="font-semibold">{user?.stats?.upvotesReceived ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Followers</dt>
                    <dd className="font-semibold">{user?.stats?.followers ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Following</dt>
                    <dd className="font-semibold">{user?.stats?.following ?? 0}</dd>
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
                <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                <p className="text-gray-600 text-sm">
                  Coming soon: posts and comments from your activity.
                </p>
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
                      <Link href={`/profile/${u.id}`} className="text-blue-700 hover:underline">
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

        {tab === 'edit' && form && (
          <div className="rounded-lg bg-white shadow p-4 max-w-xl mx-auto">
            {message && <p className="mb-3 text-sm text-gray-700">{message}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Username</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">First name</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Last name</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Website</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="website"
                  value={form.website || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Location</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="location"
                  value={form.location || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Bio</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-24 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="bio"
                  value={form.bio || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Interests (comma separated)
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="interests"
                  value={(form.interests || []).join(', ')}
                  onChange={(e) => {
                    const parts = e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                    setForm({ ...(form as EditableUser), interests: parts })
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Twitter URL</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    name="twitter"
                    value={form.social?.twitter || ''}
                    onChange={(e) =>
                      setForm({
                        ...(form as EditableUser),
                        social: { ...form.social, twitter: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">GitHub URL</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    name="github"
                    value={form.social?.github || ''}
                    onChange={(e) =>
                      setForm({
                        ...(form as EditableUser),
                        social: { ...form.social, github: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    name="linkedin"
                    value={form.social?.linkedin || ''}
                    onChange={(e) =>
                      setForm({
                        ...(form as EditableUser),
                        social: { ...form.social, linkedin: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-md"
                  onClick={() => {
                    setForm(user)
                    setMessage('')
                    setTab('overview')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
