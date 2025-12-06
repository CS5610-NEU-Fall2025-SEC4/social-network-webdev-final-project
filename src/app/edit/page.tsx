'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRequireAuth } from '@/app/hooks/useRequireAuth'
import { useAppDispatch } from '@/app/store'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '@/app/store/profileSlice'
import { fetchProfile, updateProfileThunk } from '@/app/store/profileSlice'

type EditableUser = {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  bio?: string
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
}

export default function EditProfilePage() {
  const { loading, authenticated } = useRequireAuth()
  const dispatch = useAppDispatch()
  const profileState = useSelector(
    (s: unknown) => (s as { profile: StoreProfileState }).profile,
  ) as StoreProfileState

  const [form, setForm] = useState<EditableUser | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && authenticated && profileState.status === 'idle') {
      void dispatch(fetchProfile())
    }
  }, [loading, authenticated, profileState.status, dispatch])

  useEffect(() => {
    const p = profileState.id ? profileState : null
    if (p) {
      setForm({
        id: p.id!,
        username: p.username!,
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: p.email || '',
        bio: p.bio ?? undefined,
        location: p.location ?? undefined,
        website: p.website ?? undefined,
        interests: p.interests || [],
        social: p.social || {},
        visibility: p.visibility || {},
      })
    }
  }, [profileState])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return
    const { name, value } = e.target
    setForm({ ...form, [name]: value } as EditableUser)
  }

  const handleSave = async () => {
    if (!form) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    setSaving(true)
    setError(null)
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
      setError(null)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errMsg)
      console.error('Profile update error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !authenticated) return null

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-4 max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-gray-700 hover:text-blue-700 !no-underline text-sm"
        >
          &lt; Back to Profile
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || !form}
          className="px-3 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 max-w-4xl mx-auto p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="max-w-4xl mx-auto rounded-lg bg-white shadow p-4 grid gap-4">
        <div>
          <label className="block text-sm text-gray-700">Username</label>
          <input
            name="username"
            value={form?.username || ''}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">First Name</label>
            <input
              name="firstName"
              value={form?.firstName || ''}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Last Name</label>
            <input
              name="lastName"
              value={form?.lastName || ''}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={form?.email || ''}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={form?.bio || ''}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Website</label>
            <input
              name="website"
              value={form?.website || ''}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Location</label>
            <input
              name="location"
              value={form?.location || ''}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Interests (comma-separated)</label>
          <input
            name="interests"
            value={(form?.interests || []).join(',')}
            onChange={(e) => {
              const val = e.target.value
              setForm((prev) =>
                prev ? { ...prev, interests: val.split(',').map((t) => t.trim()) } : prev,
              )
            }}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Twitter</label>
            <input
              name="twitter"
              value={form?.social?.twitter || ''}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, social: { ...prev.social, twitter: e.target.value } } : prev,
                )
              }
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">GitHub</label>
            <input
              name="github"
              value={form?.social?.github || ''}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, social: { ...prev.social, github: e.target.value } } : prev,
                )
              }
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">LinkedIn</label>
            <input
              name="linkedin"
              value={form?.social?.linkedin || ''}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, social: { ...prev.social, linkedin: e.target.value } } : prev,
                )
              }
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
