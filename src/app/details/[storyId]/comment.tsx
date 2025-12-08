'use client'

import { useState } from 'react'
import { HNStory, HNStoryItem } from '../../types/types'
import EditCommentButton from './EditCommentButton'
import DeleteCommentButton from './DeleteCommentButton'
import CommentEditForm from './CommentEditForm'
import ReportButton from './ReportButton'
import { Card, CardContent } from '@/components/ui/card'
import UsernameLink from '@/app/components/username-link'
import BookmarkIcon from '@/app/components/BookmarkIcon'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '@/app/store/profileSlice'
import InteractionButtons from './InteractionButtons'
import { FaUser, FaStar } from 'react-icons/fa'
import { FaRegClock } from 'react-icons/fa6'

interface CommentProps {
  comment: HNStoryItem | HNStory
  storyId: string
  depth?: number
}

export default function Comment({ comment, storyId, depth = 0 }: CommentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const profileState = useSelector(
    (s: unknown) => (s as { profile: StoreProfileState }).profile,
  ) as StoreProfileState
  const bookmarks = (profileState as unknown as { bookmarks?: string[] }).bookmarks || []
  const commentId = String(comment.id)
  const initiallyBookmarked = bookmarks.includes(commentId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }
  const wasEdited = () => {
    if (!comment.editedAt) return false
    const createdTime = new Date(comment.created_at).getTime()
    const editedTime = new Date(comment.editedAt).getTime()
    return editedTime - createdTime > 60000
  }

  const hasNestedChildren = (
    comment: HNStoryItem | HNStory,
  ): comment is HNStoryItem & { children: HNStoryItem[] } => {
    return (
      comment.children && comment.children.length > 0 && typeof comment.children[0] === 'object'
    )
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
  }

  return (
    <Card className="border-l-4 border-l-cyan-400 mb-3">
      <CardContent className="py-3 sm:py-4 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaUser className="shrink-0" />
              <UsernameLink username={comment.author} className="font-semibold text-cyan-600" />
            </span>

            <span className="flex items-center gap-1">
              <FaRegClock className="shrink-0" />
              <span className="truncate">{formatDate(comment.created_at)}</span>
            </span>

            <span className="flex items-center gap-1">
              <FaStar className="shrink-0" />
              <span>{comment.points} points</span>
            </span>

            {wasEdited() && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded flex-shrink-0">
                edited
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <EditCommentButton authorUsername={comment.author} onEditClick={handleEditClick} />
            <DeleteCommentButton
              commentId={comment.id}
              authorUsername={comment.author}
              commentText={comment.text || ''}
            />
            <BookmarkIcon itemId={commentId} initiallyBookmarked={initiallyBookmarked} />
            <ReportButton
              storyId={String(comment.id)}
              contentType="comment"
              authorUsername={comment.author}
            />
          </div>
        </div>

        {isEditing ? (
          <CommentEditForm
            commentId={comment.id}
            initialText={comment.text || ''}
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
          />
        ) : (
          <>
            {comment.text && (
              <div
                className="prose prose-sm sm:prose max-w-none text-gray-700 mb-3"
                dangerouslySetInnerHTML={{ __html: comment.text }}
              />
            )}

            <InteractionButtons
              itemId={comment.id}
              itemType="comment"
              initialPoints={comment.points || 0}
              storyId={storyId}
              parentId={comment.id}
              depth={depth}
              isStoryLevel={false}
            />
          </>
        )}
        {hasNestedChildren(comment) && depth < 1 && (
          <div className="ml-3 sm:ml-6 mt-3 sm:mt-4 space-y-3 border-l-2 border-gray-200 pl-3 sm:pl-4">
            {comment.children.map((child) => (
              <Comment key={child.id} comment={child} storyId={storyId} depth={depth + 1} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
