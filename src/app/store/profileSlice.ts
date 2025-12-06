import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface UserRef {
  id: string
  username: string
}
export interface ProfileState {
  id?: string
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  bio?: string | null
  location?: string | null
  website?: string | null
  interests?: string[]
  social?: { twitter?: string; github?: string; linkedin?: string }
  followers?: UserRef[]
  following?: UserRef[]
  bookmarks?: string[]
  stats?: { posts: number; comments: number }
  createdAt?: string
  updatedAt?: string
  visibility?: {
    name?: boolean
    bio?: boolean
    location?: boolean
    website?: boolean
    interests?: boolean
    social?: boolean
  }
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: ProfileState = {
  status: 'idle',
}

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  // Use the same key as AuthContext (`access_token`)
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to load profile')
  return (await res.json()) as Omit<ProfileState, 'status' | 'error'>
})

export const updateProfileThunk = createAsyncThunk(
  'profile/updateProfile',
  async (updates: {
    username: string
    firstName: string
    lastName: string
    email: string
    bio?: string
    location?: string
    website?: string
    interests: string[]
    twitter?: string
    github?: string
    linkedin?: string
    visibility?: {
      name?: boolean
      bio?: boolean
      location?: boolean
      website?: boolean
      interests?: boolean
      social?: boolean
    }
  }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Failed to update profile')
    }
    return (await res.json()) as Omit<ProfileState, 'status' | 'error'>
  },
)

export const followUserThunk = createAsyncThunk(
  'profile/followUser',
  async (targetUserId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(targetUserId)}/follow`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    if (!res.ok) throw new Error(await res.text())
    return (await res.json()) as Omit<ProfileState, 'status' | 'error'>
  },
)

export const unfollowUserThunk = createAsyncThunk(
  'profile/unfollowUser',
  async (targetUserId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(targetUserId)}/unfollow`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    if (!res.ok) throw new Error(await res.text())
    return (await res.json()) as Omit<ProfileState, 'status' | 'error'>
  },
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileState: () => initialState,
    addBookmarkLocal: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.bookmarks = Array.from(new Set([...(state.bookmarks || []), id]))
    },
    removeBookmarkLocal: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.bookmarks = (state.bookmarks || []).filter((b) => b !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<Omit<ProfileState, 'status' | 'error'>>) => {
          Object.assign(state, action.payload)
          state.status = 'succeeded'
        },
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(
        updateProfileThunk.fulfilled,
        (state, action: PayloadAction<Omit<ProfileState, 'status' | 'error'>>) => {
          Object.assign(state, action.payload)
          state.status = 'succeeded'
        },
      )
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(followUserThunk.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(
        followUserThunk.fulfilled,
        (state, action: PayloadAction<Omit<ProfileState, 'status' | 'error'>>) => {
          Object.assign(state, action.payload)
          state.status = 'succeeded'
        },
      )
      .addCase(followUserThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(unfollowUserThunk.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(
        unfollowUserThunk.fulfilled,
        (state, action: PayloadAction<Omit<ProfileState, 'status' | 'error'>>) => {
          Object.assign(state, action.payload)
          state.status = 'succeeded'
        },
      )
      .addCase(unfollowUserThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { resetProfileState, addBookmarkLocal, removeBookmarkLocal } = profileSlice.actions
export default profileSlice.reducer
