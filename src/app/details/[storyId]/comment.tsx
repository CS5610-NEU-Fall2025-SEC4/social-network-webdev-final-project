'use client'

import { useState } from 'react'
import { HNStory, HNStoryItem } from '../../types/types'
import CommentEditor from './CommentEditor'
import EditCommentButton from './EditCommentButton'
import DeleteCommentButton from './DeleteCommentButton'
import CommentEditForm from './CommentEditForm'
import ReportButton from './ReportButton'
import { Card, CardContent } from '@/components/ui/card'
import UsernameLink from '@/app/components/username-link'
import BookmarkIcon from '@/app/components/BookmarkIcon'
import { useSelector } from 'react-redux'
import type { ProfileState as StoreProfileState } from '@/app/store/profileSlice'
import LikeButton from './LikeButton'

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
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <UsernameLink username={comment.author} className="font-semibold text-cyan-600" />
            <span>•</span>
            <span>{formatDate(comment.created_at)}</span>
            <span>•</span>
            <span>{comment.points} points</span>
            {wasEdited() && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">edited</span>
            )}
          </div>

          <div className="flex items-center gap-1">
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
                className="prose prose-sm max-w-none text-gray-700 mb-3"
                dangerouslySetInnerHTML={{ __html: comment.text }}
              />
            )}
            <div className="flex items-center gap-2">
              <LikeButton
                itemId={comment.id}
                itemType="comment"
                initialPoints={comment.points || 0}
              />
              <CommentEditor comment="Reply" storyId={storyId} parentId={comment.id} />
            </div>
          </>
        )}

        {hasNestedChildren(comment) && depth < 1 && (
          <div className="ml-6 mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
            {comment.children.map((child) => (
              <Comment key={child.id} comment={child} storyId={storyId} depth={depth + 1} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
