'use client'

import { useState } from 'react'
import { HNApiService } from '@/app/services/algoliaAPI'
import { getUserIdByUsername } from '@/app/services/authAPI'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import ExternalLinkPrompt from './ExternalLinkPrompt'

interface UsernameLinkProps {
  username: string
  className?: string
}

const userCache = new Map<string, { isHN: boolean; internalId: string | null }>()

export default function UsernameLink({ username, className }: UsernameLinkProps) {
  const [isResolving, setIsResolving] = useState(false)
  const [showExternalPrompt, setShowExternalPrompt] = useState(false)
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (isResolving) return

    setIsResolving(true)

    try {
      if (userCache.has(username)) {
        const cached = userCache.get(username)!
        if (cached.isHN) {
          setShowExternalPrompt(true)
        } else if (cached.internalId) {
          router.push(`/profile/${cached.internalId}`)
        } else {
          console.warn(`User ${username} not found on HN or internally.`)
        }
        setIsResolving(false)
        return
      }

      let id: string | null = null
      try {
        id = await getUserIdByUsername(username)
      } catch (error) {
        id = null
      }

      if (id) {
        userCache.set(username, { isHN: false, internalId: id })
        router.push(`/profile/${id}`)
      } else {
        setShowExternalPrompt(true)
      }
    } finally {
      setIsResolving(false)
    }
  }

  const handleConfirmExternal = async () => {
    setShowExternalPrompt(false)
    setIsResolving(true)

    try {
      let hnExists = false
      try {
        hnExists = await HNApiService.doesUserExist(username)
      } catch (error) {
        hnExists = false
      }

      if (hnExists) {
        userCache.set(username, { isHN: true, internalId: null })
        window.open(`https://news.ycombinator.com/user?id=${username}`, '_blank')
      } else {
        userCache.set(username, { isHN: false, internalId: null })
        console.warn(`User ${username} not found on HN or internally.`)
      }
    } finally {
      setIsResolving(false)
    }
  }

  return (
    <>
      <span
        className={cn('cursor-pointer', className, isResolving && 'opacity-70')}
        onClick={handleClick}
        title={isResolving ? `Resolving ${username}...` : `Click to view profile of ${username}`}
      >
        {isResolving ? `Resolving ${username}...` : username}
      </span>
      <ExternalLinkPrompt
        open={showExternalPrompt}
        onClose={() => setShowExternalPrompt(false)}
        onConfirm={handleConfirmExternal}
        url={`https://news.ycombinator.com/user?id=${username}`}
      />
    </>
  )
}
