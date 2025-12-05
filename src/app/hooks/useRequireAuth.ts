'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export function useRequireAuth(redirectUrl = '/logIn') {
  const { authenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push(redirectUrl)
    }
  }, [authenticated, loading, router, redirectUrl])

  return { authenticated, loading }
}
