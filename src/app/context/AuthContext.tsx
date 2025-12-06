'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import {
  fetchProfile,
  login as apiLogin,
  register as apiRegister,
  updateProfile as apiUpdateProfile,
} from '../services/authAPI'
import { useRouter } from 'next/navigation'

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

interface AuthContextValue {
  token: string | null
  profile: ProfileData | null
  loading: boolean
  authenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (updates: UpdateProfilePayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('userProfile')
    setToken(null)
    setProfile(null)
    setAuthenticated(false)
    router.push('/logIn')
  }, [router])

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (stored) {
      setToken(stored)
      setAuthenticated(true)
      ;(async () => {
        try {
          const prof = await fetchProfile(stored)
          setProfile(prof)
          localStorage.setItem('userProfile', JSON.stringify(prof))
        } catch {
          logout()
        } finally {
          setLoading(false)
        }
      })()
    } else {
      setLoading(false)
    }
  }, [logout])

  const login = async (payload: LoginPayload) => {
    const data = await apiLogin(payload)
    const at = data.access_token || data.token
    if (at) {
      localStorage.setItem('access_token', at)
      setToken(at)
      setAuthenticated(true)

      const prof = await fetchProfile(at)
      setProfile(prof)
      localStorage.setItem('userProfile', JSON.stringify(prof))
    }
  }

  const register = async (payload: RegisterPayload) => {
    await apiRegister(payload)
  }

  const refreshProfile = async () => {
    if (!token) return
    try {
      const prof = await fetchProfile(token)
      setProfile(prof)
      localStorage.setItem('userProfile', JSON.stringify(prof))
    } catch (e) {
      console.warn('Failed to refresh profile', e)
      logout()
    }
  }

  const updateProfile = async (updates: UpdateProfilePayload) => {
    if (!token) return
    try {
      const prof = await apiUpdateProfile(token, updates)
      setProfile(prof)
      localStorage.setItem('userProfile', JSON.stringify(prof))
    } catch (e) {
      console.warn('Failed to update profile', e)
      logout()
      throw e
    }
  }

  const value: AuthContextValue = {
    token,
    profile,
    loading,
    authenticated,
    login,
    register,
    refreshProfile,
    updateProfile,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
