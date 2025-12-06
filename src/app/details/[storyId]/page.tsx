import { HNApiService } from '../../services/algoliaAPI'
import type { HNStoryItem } from '@/app/types/types'
import 'server-only'
import Link from 'next/link'
import { FaUser, FaStar, FaCommentAlt } from 'react-icons/fa'
import { FaRegClock, FaLink } from 'react-icons/fa6'
import Comment from './comment'
import LikeButton from './LikeButton'
import CommentEditor from './CommentEditor'
import UsernameLink from '@/components/username-link'
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

  let story: HNStoryItem
  if (isInternalStory) {
    const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
    const res = await fetch(`${base}/story/${storyId}/full`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('Failed to load story')
    story = await res.json()
  } else {
    story = await HNApiService.getItemFromSource(storyId, 'hackernews')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const tags = tagsQuery ? tagsQuery.split(',') : []
  console.log(tags)
  const filteredTags = tags.filter((tag) =>
    ['story', 'ask_hn', 'show_hn', 'job', 'comment'].includes(tag),
  )
  console.log(filteredTags)

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
              <ReportButton storyId={storyId} contentType="story" />
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
            {story.points && (
              <span className="flex items-center gap-1">
                <FaStar /> {story.points} points
              </span>
            )}
            <span className="flex items-center gap-1">
              <FaRegClock /> {formatDate(story.created_at_i)}
            </span>
            {(story.children || []).length > 0 && (
              <span className="flex items-center gap-1">{story.children.length} comments</span>
            )}
            <span className="flex items-center">
              <DetailsBookmark itemId={storyId} />
            </span>
          </div>

          {story.url && (
            <Link
              href={story.url}
              target="_blank"
              className="text-blue-600 hover:underline mb-4 inline-block"
            >
              <span className="flex items-center gap-1">
                <FaLink /> {story.url}
              </span>
            </Link>
          )}

          {story.text && (
            <div
              className="mt-6 pt-6 border-t prose max-w-none"
              dangerouslySetInnerHTML={{ __html: story.text }}
            />
          )}
        </div>

        <div className="flex mt-3 mb-4">
          <LikeButton />
          <CommentEditor comment="Comment" storyId={storyId} />
        </div>

        {story.children && story.children.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaCommentAlt /> Comments
              {/* <FaCommentAlt /> {story.children.length} Comments */}
            </h2>

            <div className="space-y-4">
              {story.children.map((comment) => (
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
