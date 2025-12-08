'use client'

import { useState } from 'react'
import { FaCommentAlt, FaRegCommentAlt } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import LikeButton from './LikeButton'
import CommentEditor from './CommentEditor'

interface InteractionButtonsProps {
  itemId: string | number
  itemType: 'story' | 'comment'
  initialPoints?: number
  storyId: string
  parentId?: string | number
  depth?: number
  showCommentButton?: boolean
  isStoryLevel?: boolean
}

export default function InteractionButtons({
  itemId,
  itemType,
  initialPoints = 0,
  storyId,
  parentId,
  depth = 0,
  showCommentButton = true,
  isStoryLevel = false,
}: InteractionButtonsProps) {
  const [showEditor, setShowEditor] = useState(false)

  const handleCommentClick = () => {
    setShowEditor(!showEditor)
  }

  const handleCommentSuccess = () => {
    setShowEditor(false)
  }

  const shouldShowCommentButton = showCommentButton && depth < 1

  const editorWidthClass = isStoryLevel ? 'w-full md:w-3/4' : 'w-full'

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <LikeButton itemId={itemId} itemType={itemType} initialPoints={initialPoints} />

        {shouldShowCommentButton && (
          <Button variant="ghost" onClick={handleCommentClick} className="gap-2">
            {showEditor ? <FaCommentAlt /> : <FaRegCommentAlt />}
            {parentId ? 'Reply' : 'Comment'}
          </Button>
        )}
      </div>

      {shouldShowCommentButton && showEditor && (
        <div className={`mt-2 ${editorWidthClass}`}>
          <CommentEditor
            storyId={storyId}
            parentId={parentId}
            onSuccess={handleCommentSuccess}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      )}
    </div>
  )
}
