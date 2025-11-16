'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  fetchProfile,
  login as apiLogin,
  register as apiRegister,
  updateProfile as apiUpdateProfile,
} from '../services/authAPI'

export interface ProfileData {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  bio?: string
  location?: string
  website?: string
  interests?: string[]
  social?: { twitter?: string; github?: string; linkedin?: string }
  createdAt?: string
  updatedAt?: string
}
export interface UpdateProfilePayload {
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
          setAuthenticated(false)
          setToken(null)
        } finally {
          setLoading(false)
        }
      })()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (payload: LoginPayload) => {
    const data = await apiLogin(payload)
    const at = data.access_token || data.token
    if (at) {
      localStorage.setItem('access_token', at)
      setToken(at)
      setAuthenticated(true)
      await refreshProfile()
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
    }
  }

  const updateProfile = async (updates: UpdateProfilePayload) => {
    if (!token) return
    const prof = await apiUpdateProfile(token, updates)
    setProfile(prof)
    localStorage.setItem('userProfile', JSON.stringify(prof))
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('userProfile')
    setToken(null)
    setProfile(null)
    setAuthenticated(false)
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
