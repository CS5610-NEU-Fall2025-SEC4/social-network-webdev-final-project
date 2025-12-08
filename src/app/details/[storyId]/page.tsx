import { HNApiService } from '../../services/algoliaAPI'
import type { HNStoryItem } from '@/app/types/types'
import 'server-only'
import Link from 'next/link'
import { FaUser, FaStar, FaCommentAlt } from 'react-icons/fa'
import { FaRegClock } from 'react-icons/fa6'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Comment from './comment'
import InteractionButtons from './InteractionButtons'
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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1 min-w-0 break-words">
              {story.title ||
                (story.text ? stripHtml(story.text).slice(0, 80) : `Story ${storyId}`)}
            </h1>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
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
              <DetailsBookmark itemId={storyId} />
            </div>
          </div>

          {filteredTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filteredTags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs sm:text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <FaUser className="shrink-0" /> <UsernameLink username={story.author} />
            </span>
            <span className="flex items-center gap-1">
              <FaStar className="shrink-0" /> {likeCount} points
            </span>
            <span className="flex items-center gap-1">
              <FaRegClock className="shrink-0" /> {formatDate(story.created_at_i)}
            </span>
            {story.commentCount !== undefined && (
              <span className="flex items-center gap-1">
                <FaCommentAlt className="shrink-0" />
                {story.commentCount} comment{story.commentCount !== 1 ? 's' : ''}
              </span>
            )}
            {isExternal && (
              <div className="flex items-center gap-1">
                <FaExternalLinkAlt className="flex-shrink-0" />
                <Link
                  href={`https://news.ycombinator.com/item?id=${storyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  Original Post
                </Link>
              </div>
            )}
            {wasEdited() && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded flex-shrink-0">
                edited
              </span>
            )}
          </div>

          {story.text && (
            <div
              className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t prose prose-sm sm:prose max-w-none"
              dangerouslySetInnerHTML={{ __html: story.text }}
            />
          )}
        </div>

        <div className="mt-3 mb-4">
          <InteractionButtons
            itemId={storyId}
            itemType="story"
            initialPoints={story.points || 0}
            storyId={storyId}
            depth={0}
            isStoryLevel={true}
          />
        </div>

        {story.children && story.children.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
              <FaCommentAlt /> Comments
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {[...story.children]
                .sort((a, b) => (b.created_at_i || 0) - (a.created_at_i || 0))
                .map((comment) => (
                  <Comment key={comment.id} comment={comment} storyId={storyId} />
                ))}
            </div>
          </div>
        )}

        {(!story.children || story.children.length === 0) && (
          <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            No comments yet
          </div>
        )}
      </div>
    </div>
  )
}
