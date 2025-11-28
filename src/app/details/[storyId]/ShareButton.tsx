'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FaShare, FaCheck } from 'react-icons/fa'

interface ShareButtonProps {
  storyId: string
  title: string
  tags: string[]
}

export default function ShareButton({ storyId, title, tags }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/details/${storyId}?tags=${encodeURIComponent(tags?.join(',') || '')}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center gap-2">
      {copied ? (
        <>
          <FaCheck className="text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <FaShare />
          Share
        </>
      )}
    </Button>
  )
}
