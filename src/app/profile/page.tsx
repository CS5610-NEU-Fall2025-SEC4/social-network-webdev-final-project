'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import UserDetails from '../details/user'
import { useAuth } from '../context/AuthContext'

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
}

export default function ProfilePage() {
  const { profile, loading, authenticated, refreshProfile, updateProfile } = useAuth()
  const [tab, setTab] = useState<'overview' | 'edit'>('overview')
  const [user, setUser] = useState<EditableUser | null>(null)
  const [form, setForm] = useState<EditableUser | null>(null)
  const [message, setMessage] = useState<string>('')

  const initials = useMemo(() => {
    if (!user) return 'U'
    const a = user.firstName?.[0] || ''
    const b = user.lastName?.[0] || ''
    return (a + b || user.username?.[0] || 'U').toUpperCase()
  }, [user])

  useEffect(() => {
    if (!loading && authenticated && profile) {
      const editable: EditableUser = {
        id: profile.id,
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        interests: profile.interests || [],
        social: profile.social || {},
      }
      setUser(editable)
      setForm(editable)
    }
  }, [loading, authenticated, profile])

  useEffect(() => {
    if (!loading && authenticated && !profile) {
      void refreshProfile()
    }
  }, [loading, authenticated, profile, refreshProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setMessage('')
  }

  const handleSave = async () => {
    if (!form) return
    if (!form.username.trim()) {
      setMessage('Username is required.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setMessage('Please enter a valid email address.')
      return
    }
    try {
      await updateProfile({
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
      })
      setMessage('Profile updated successfully.')
      await refreshProfile()
      setTab('overview')
    } catch {
      setMessage('Failed to update profile.')
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-2">
        <Link
          href="/home"
          className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-600 !no-underline text-sm"
        >
          &lt; Back
        </Link>
      </div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
          {initials}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 leading-tight">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600">@{user?.username}</p>
        </div>
        {user?.username && (
          <Link
            href={`/u/${encodeURIComponent(user.username)}`}
            className="px-3 py-2 bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 rounded-md text-sm"
          >
            View my public profile
          </Link>
        )}
      </div>

      {}
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        <button
          className={`px-3 py-2 text-sm rounded-t ${tab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-3 py-2 text-sm rounded-t ${tab === 'edit' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setTab('edit')}
        >
          Edit Profile
        </button>
      </div>

      {tab === 'overview' && (
        <div className="grid gap-4 md:grid-cols-3">
          {}
          <div className="md:col-span-2 grid gap-4">
            <div className="rounded-md border border-gray-200 p-4">
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
            <div className="rounded-md border border-gray-200 p-4">
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-gray-700 whitespace-pre-line">{user?.bio || 'No bio yet.'}</p>
            </div>
            <div className="rounded-md border border-gray-200 p-4">
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
            <div className="rounded-md border border-gray-200 p-4">
              <h3 className="text-lg font-medium mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {(user?.interests || []).map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                    {tag}
                  </span>
                ))}
                {!user?.interests?.length && (
                  <p className="text-gray-500 text-sm">No interests added yet.</p>
                )}
              </div>
            </div>
            <div className="rounded-md border border-gray-200 p-4">
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

          {}
          <div className="grid gap-4">
            <div className="rounded-md border border-gray-200 p-4">
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
            <div className="rounded-md border border-gray-200 p-4">
              <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
              <p className="text-gray-600 text-sm">
                Coming soon: posts and comments from your activity.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === 'edit' && form && (
        <div className="rounded-md border border-gray-200 p-4 max-w-xl">
          {message && <p className="mb-3 text-sm text-gray-700">{message}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">First name</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Last name</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Website</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                name="website"
                value={form.website || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Location</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                name="location"
                value={form.location || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Bio</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-24"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                name="interests"
                value={(form.interests || []).join(', ')}
                onChange={(e) => {
                  const parts = e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  setForm({ ...form, interests: parts })
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Twitter URL</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  name="twitter"
                  value={form.social?.twitter || ''}
                  onChange={(e) =>
                    setForm({ ...form, social: { ...form.social, twitter: e.target.value } })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">GitHub URL</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  name="github"
                  value={form.social?.github || ''}
                  onChange={(e) =>
                    setForm({ ...form, social: { ...form.social, github: e.target.value } })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  name="linkedin"
                  value={form.social?.linkedin || ''}
                  onChange={(e) =>
                    setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                onClick={() => {
                  setForm(user)
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
  )
}
