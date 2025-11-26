'use client'

import { HNStory, HNStoryItem } from '../../types/types'
import CommentEditor from './CommentEditor'
import { Card, CardContent } from '@/components/ui/card'

interface CommentProps {
  comment: HNStoryItem | HNStory
  storyId: string
}

export default function Comment({ comment, storyId }: CommentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const hasNestedChildren = (
    comment: HNStoryItem | HNStory,
  ): comment is HNStoryItem & { children: HNStoryItem[] } => {
    return (
      comment.children && comment.children.length > 0 && typeof comment.children[0] === 'object'
    )
  }
  return (
    <Card className="border-l-4 border-l-orange-400 mb-3">
      <CardContent className="py-4">
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
          <span className="font-semibold text-orange-600">{comment.author}</span>
          <span>•</span>
          <span>{formatDate(comment.created_at)}</span>
          <span>•</span>
          <span>{comment.points} points</span>
        </div>
        {comment.text && (
          <div
            className="prose prose-sm max-w-none text-gray-700 mb-3"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />
        )}
        <CommentEditor comment="Reply" storyId={storyId} parentId={comment.id} />
        {hasNestedChildren(comment) && (
          <div className="ml-6 mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
            {comment.children.map((child) => (
              <Comment key={child.id} comment={child} storyId={storyId} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
