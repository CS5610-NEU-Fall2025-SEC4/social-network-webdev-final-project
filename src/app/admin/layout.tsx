'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminNavbar from './components/AdminNavbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, authenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!authenticated) {
      router.push('/logIn')
      return
    }

    if (profile?.role !== 'ADMIN') {
      router.push('/home')
      return
    }
  }, [authenticated, profile, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!authenticated || profile?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use AdminNavbar instead of sidebar */}
      <AdminNavbar username={profile?.username} />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">{children}</main>
    </div>
  )
}
