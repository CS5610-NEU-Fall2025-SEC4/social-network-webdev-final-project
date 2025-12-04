'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminSidebar from './components/AdminSidebar'

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }
  if (!authenticated || profile?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-gray-900">{profile?.username}</span>
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                ADMIN
              </span>
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
