import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface UserRef {
  id: string
  username: string
}
export interface PublicProfileState {
  id?: string
  username?: string
  firstName?: string
  lastName?: string
  bio?: string | null
  location?: string | null
  website?: string | null
  interests?: string[]
  social?: { twitter?: string; github?: string; linkedin?: string }
  followers?: UserRef[]
  following?: UserRef[]
  createdAt?: string
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: PublicProfileState = {
  status: 'idle',
}

export const fetchPublicProfileById = createAsyncThunk(
  'publicProfile/fetchById',
  async (id: string) => {
    const res = await fetch(`${API_BASE}/users/${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Profile not found')
    return (await res.json()) as Omit<PublicProfileState, 'status' | 'error'>
  },
)

const publicProfileSlice = createSlice({
  name: 'publicProfile',
  initialState,
  reducers: {
    resetPublicProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicProfileById.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(
        fetchPublicProfileById.fulfilled,
        (state, action: PayloadAction<Omit<PublicProfileState, 'status' | 'error'>>) => {
          Object.assign(state, action.payload)
          state.status = 'succeeded'
        },
      )
      .addCase(fetchPublicProfileById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { resetPublicProfile } = publicProfileSlice.actions
export default publicProfileSlice.reducer
