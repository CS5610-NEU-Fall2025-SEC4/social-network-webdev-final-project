import { HNApiService } from '../../services/algoliaAPI'
import type { HNStoryItem } from '@/app/types/types'
import 'server-only'
import Link from 'next/link'
import { FaUser, FaStar, FaCommentAlt } from 'react-icons/fa'
import { FaRegClock } from 'react-icons/fa6'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Comment from './comment'
import LikeButton from './LikeButton'
import CommentEditor from './CommentEditor'
import UsernameLink from '@/app/components/username-link'
import EditButton from './EditButton'
import DeleteButton from './DeleteButton'
import ShareButton from './ShareButton'
import ReportButton from './ReportButton'
import DetailsBookmark from '../DetailsBookmark'

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function getLikeCount(itemId: string): Promise<number> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
    const res = await fetch(`${base}/likes/${itemId}/status`, {
      cache: 'no-store',
    })
    if (res.ok) {
      const data = await res.json()
      return data.totalPoints || 0
    }
    return 0
  } catch (error) {
    console.error('Error fetching like count:', error)
    return 0
  }
}

export default async function DetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ storyId: string }>
  searchParams: Promise<{ tags?: string }>
}) {
  const { storyId } = await params
  const { tags: tagsQuery } = await searchParams

  const isInternalStory = isNaN(Number(storyId))

  let story: HNStoryItem | null = null

  if (isInternalStory) {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
      const res = await fetch(`${base}/story/${storyId}/full`, {
        cache: 'no-store',
      })
      if (res.ok) {
        story = await res.json()
      }
    } catch (error) {
      console.error('Error fetching internal story:', error)
    }
  } else {
    story = await HNApiService.getItemFromSource(storyId, 'hackernews').catch(() => null)
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            The story you are looking for could not be found. It may have been deleted or does not
            exist.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-600 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }
  const likeCount = await getLikeCount(storyId)
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }
  const wasEdited = () => {
    if (!story.editedAt) return false
    const createdTime = story.created_at_i * 1000
    const editedTime = new Date(story.editedAt).getTime()
    return editedTime - createdTime > 60000
  }

  const tags = tagsQuery ? tagsQuery.split(',') : []
  console.log(tags)
  const filteredTags = tags.filter((tag) =>
    ['story', 'ask_hn', 'show_hn', 'job', 'comment'].includes(tag),
  )
  console.log(filteredTags)
  const isExternal = !isNaN(Number(storyId))
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex-1 min-w-0">
              {story.title ||
                (story.text ? stripHtml(story.text).slice(0, 80) : `Story ${storyId}`)}
            </h1>
            <div className="flex flex-wrap gap-2">
              <ShareButton
                storyId={storyId}
                title={story.title || (story.text ? stripHtml(story.text).slice(0, 80) : '')}
                tags={filteredTags}
              />
              <EditButton storyId={storyId} authorUsername={story.author} />
              <DeleteButton
                storyId={storyId}
                authorUsername={story.author}
                title={
                  story.title || (story.text ? stripHtml(story.text).slice(0, 80) : 'Untitled')
                }
              />
              <ReportButton storyId={storyId} contentType="story" authorUsername={story.author} />
            </div>
          </div>

          {filteredTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filteredTags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 items-center">
            <span className="flex items-center gap-1">
              <FaUser /> <UsernameLink username={story.author} />
            </span>
            <span className="flex items-center gap-1">
              <FaStar /> {likeCount} points
            </span>
            <span className="flex items-center gap-1">
              <FaRegClock /> {formatDate(story.created_at_i)}
            </span>
            {story.commentCount !== undefined && (
              <span className="flex items-center gap-1">
                <FaCommentAlt />
                {story.commentCount} comment{story.commentCount !== 1 ? 's' : ''}
              </span>
            )}
            {isExternal && (
              <div className="flex items-center gap-1">
                <FaExternalLinkAlt />
                <Link
                  href={`https://news.ycombinator.com/item?id=${storyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Original Post
                </Link>
              </div>
            )}
            {wasEdited() && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">edited</span>
            )}
            <span className="flex items-center">
              <DetailsBookmark itemId={storyId} />
            </span>
          </div>

          {story.text && (
            <div
              className="mt-6 pt-6 border-t prose max-w-none"
              dangerouslySetInnerHTML={{ __html: story.text }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 mb-4 flex-wrap">
          <LikeButton itemId={storyId} itemType="story" initialPoints={likeCount} />
          <CommentEditor comment="Comment" storyId={storyId} />
        </div>

        {story.children && story.children.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaCommentAlt /> Comments
            </h2>

            <div className="space-y-4">
              {[...story.children]
                .sort((a, b) => (b.created_at_i || 0) - (a.created_at_i || 0))
                .map((comment) => (
                  <Comment key={comment.id} comment={comment} storyId={storyId} />
                ))}
            </div>
          </div>
        )}

        {(!story.children || story.children.length === 0) && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            No comments yet
          </div>
        )}
      </div>
    </div>
  )
}
