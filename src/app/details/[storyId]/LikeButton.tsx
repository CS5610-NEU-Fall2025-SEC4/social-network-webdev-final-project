'use client'

import { useState } from 'react'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import { Button } from '@/components/ui/button'

export default function LikeButton() {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Button variant="ghost" onClick={() => setIsLiked(!isLiked)} className="gap-2">
      {isLiked ? <BiSolidLike className="text-blue-600" /> : <BiLike />}
      <span>Like</span>
    </Button>
  )
}
