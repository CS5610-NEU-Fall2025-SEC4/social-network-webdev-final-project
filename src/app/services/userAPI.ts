export type PublicProfile = {
  id: string
  username: string
  firstName: string
  lastName: string
  avatarUrl?: string
  bio?: string | null
  location?: string | null
  website?: string | null
  interests?: string[]
  social?: { twitter?: string; github?: string; linkedin?: string }
  followers?: { id: string; username: string }[]
  following?: { id: string; username: string }[]
  createdAt?: string
  role: string
}

export type Profile = PublicProfile & {
  email: string
  updatedAt?: string
  visibility?: Record<string, boolean>
  isBlocked: boolean
  bookmarks?: string[]
}

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001'

export async function getPublicProfile(userId: string): Promise<PublicProfile> {
  const res = await fetch(`${BASE}/users/${userId}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load public profile')
  return res.json()
}

export async function followUser(targetId: string, token: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/users/${targetId}/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to follow')
  return res.json()
}

export async function unfollowUser(targetId: string, token: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/users/${targetId}/unfollow`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to unfollow')
  return res.json()
}

export async function addBookmark(
  payload: { itemId: string },
  token: string,
): Promise<{
  message: string
  bookmarks: string[]
}> {
  const res = await fetch(`${BASE}/users/me/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Failed to bookmark: ${res.status} ${res.statusText} ${errText}`.trim())
  }
  return res.json()
}

export async function removeBookmark(
  payload: { itemId: string },
  token: string,
): Promise<{
  message: string
  bookmarks: string[]
}> {
  const res = await fetch(`${BASE}/users/me/bookmarks`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Failed to remove bookmark: ${res.status} ${res.statusText} ${errText}`.trim())
  }
  return res.json()
}

export async function uploadProfilePhoto(
  token: string,
  file: File,
): Promise<{ avatarUrl: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/users/me/photo`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Failed to upload photo: ${res.status} ${res.statusText} ${errText}`.trim())
  }
  return res.json()
}
