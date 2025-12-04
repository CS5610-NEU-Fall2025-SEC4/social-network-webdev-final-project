'use client'

import { useState } from 'react'
import { HNApiService } from '@/app/services/algoliaAPI'
import { getUserIdByUsername } from '@/app/services/authAPI'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface UsernameLinkProps {
  username: string
  className?: string
}

const userCache = new Map<string, { isHN: boolean; internalId: string | null }>()

export default function UsernameLink({ username, className }: UsernameLinkProps) {
  const [isResolving, setIsResolving] = useState(false)
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (isResolving) return

    setIsResolving(true)

    try {
      if (userCache.has(username)) {
        const cached = userCache.get(username)!
        if (cached.isHN) {
          window.open(`https://news.ycombinator.com/user?id=${username}`, '_blank')
        } else if (cached.internalId) {
          router.push(`/profile/${cached.internalId}`)
        } else {
          console.warn(`User ${username} not found on HN or internally.`)
        }
        setIsResolving(false)
        return
      }

      let hnExists = false
      try {
        hnExists = await HNApiService.doesUserExist(username)
      } catch (error) {
        hnExists = false
      }

      let id: string | null = null
      if (hnExists) {
        window.open(`https://news.ycombinator.com/user?id=${username}`, '_blank')
      } else {
        try {
          id = await getUserIdByUsername(username)
        } catch (error) {}
        if (id) {
          router.push(`/profile/${id}`)
        } else {
          console.warn(`User ${username} not found on HN or internally.`)
        }
      }

      userCache.set(username, { isHN: hnExists, internalId: id })
    } finally {
      setIsResolving(false)
    }
  }

  return (
    <span
      className={cn('cursor-pointer', className, isResolving && 'opacity-70')}
      onClick={handleClick}
      title={isResolving ? `Resolving ${username}...` : `Click to view profile of ${username}`}
    >
      {isResolving ? `Resolving ${username}...` : username}
    </span>
  )
}
