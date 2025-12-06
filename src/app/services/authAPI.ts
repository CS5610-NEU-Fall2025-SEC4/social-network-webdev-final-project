export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  role: 'USER' | 'EMPLOYER'
}
export interface ProfileData {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'EMPLOYER' | 'ADMIN'
  isBlocked?: boolean
  bio?: string
  location?: string
  website?: string
  interests?: string[]
  social?: { twitter?: string; github?: string; linkedin?: string }
  createdAt?: string
  updatedAt?: string
  followers?: Array<{ id: string; username: string }>
  following?: Array<{ id: string; username: string }>
}
export interface UpdateProfilePayload {
  username?: string
  firstName?: string
  lastName?: string
  email?: string
  bio?: string
  location?: string
  website?: string
  interests?: string[]
  twitter?: string
  github?: string
  linkedin?: string
}

const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function login(payload: LoginPayload) {
  const res = await fetch(`${base}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let message = 'Login failed'
    try {
      const data = await res.json()
      if (data?.message)
        message = Array.isArray(data.message) ? data.message.join(', ') : data.message
    } catch (err) {
      console.error('Login error response parse failed:', err)
    }
    throw new Error(message)
  }
  return res.json()
}

export async function register(payload: RegisterPayload) {
  const res = await fetch(`${base}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let message = 'Registration failed'
    try {
      const data = await res.json()
      if (data?.message)
        message = Array.isArray(data.message) ? data.message.join(', ') : data.message
    } catch (err) {
      console.error('Register error response parse failed:', err)
    }
    throw new Error(message)
  }
  return res.json()
}

export async function fetchProfile(token: string): Promise<ProfileData> {
  const res = await fetch(`${base}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Profile fetch failed')
  return res.json()
}

export async function updateProfile(
  token: string,
  updates: UpdateProfilePayload,
): Promise<ProfileData> {
  const res = await fetch(`${base}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Profile update failed')
  return res.json()
}

export async function getUserIdByUsername(username: string): Promise<string | null> {
  try {
    const res = await fetch(`${base}/users/search/${username}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.id
  } catch (err) {
    console.error('Get user ID by username failed:', err)
    return null
  }
}
