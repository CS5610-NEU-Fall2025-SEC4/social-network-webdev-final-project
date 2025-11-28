'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import UserDetails from '../details/user'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '../store/profileSlice'
import { fetchProfile, updateProfileThunk } from '../store/profileSlice'
import { fetchPublicProfileById } from '../store/publicProfileSlice'

// Simple toggle switch component for visibility flags
function VisibilityToggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-wide text-gray-500">Public</span>
      <button
        type="button"
        aria-pressed={checked}
        aria-label={`${label} visibility toggle (currently ${checked ? 'public' : 'private'})`}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${checked ? 'bg-cyan-600' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}

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
}

export default function ProfilePage() {
  const { loading, authenticated } = useRequireAuth()
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
        visibility: profile.visibility || {},
        stats: {},
        followers: profile.followers || [],
        following: profile.following || [],
        joined: profile.createdAt ? String(profile.createdAt) : undefined,
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
          visibility: form.visibility,
        }),
      ).unwrap()
      // Refresh public profile data before navigating so hidden fields take effect
      if (form.id) {
        // Refresh the public profile slice silently (await to ensure latest visibility flags)
        await dispatch(fetchPublicProfileById(form.id)).unwrap()
      }
      setMessage('Profile updated successfully.')
      setTab('overview')
    } catch {
      setMessage('Failed to update profile.')
    }
  }

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
                ? 'bg-white text-cyan-700 shadow-sm'
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

        {tab === 'edit' && form && (
          <div className="rounded-lg bg-gradient-to-br from-white to-cyan-50 border border-cyan-100 shadow p-6 max-w-2xl mx-auto space-y-6">
            {message && <p className="mb-3 text-sm text-gray-700">{message}</p>}
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Username</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">First name</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Last name</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Email (always private) */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {/* Website */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-gray-700">Website</label>
                  <VisibilityToggle
                    label="Website"
                    checked={form.visibility?.website !== false}
                    onChange={(val) =>
                      setForm({
                        ...(form as EditableUser),
                        visibility: { ...(form.visibility || {}), website: val },
                      })
                    }
                  />
                </div>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  name="website"
                  value={form.website || ''}
                  onChange={handleChange}
                />
              </div>
              {/* Location */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-gray-700">Location</label>
                  <VisibilityToggle
                    label="Location"
                    checked={form.visibility?.location !== false}
                    onChange={(val) =>
                      setForm({
                        ...(form as EditableUser),
                        visibility: { ...(form.visibility || {}), location: val },
                      })
                    }
                  />
                </div>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  name="location"
                  value={form.location || ''}
                  onChange={handleChange}
                />
              </div>
              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-gray-700">Bio</label>
                  <VisibilityToggle
                    label="Bio"
                    checked={form.visibility?.bio !== false}
                    onChange={(val) =>
                      setForm({
                        ...(form as EditableUser),
                        visibility: { ...(form.visibility || {}), bio: val },
                      })
                    }
                  />
                </div>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-24 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  name="bio"
                  value={form.bio || ''}
                  onChange={handleChange}
                />
              </div>
              {/* Interests (always public) */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Interests (comma separated)
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
              {/* Social links (Twitter/GitHub/LinkedIn) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Twitter URL</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="px-5 py-2.5 rounded-md bg-gradient-to-r from-black via-cyan-700 to-cyan-600 text-white font-medium shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSave}
                  disabled={profileState.status === 'loading'}
                >
                  {profileState.status === 'loading' ? 'Saving…' : 'Save Changes'}
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
