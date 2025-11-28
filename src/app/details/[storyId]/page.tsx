import { HNApiService } from '../../services/algoliaAPI'
import Link from 'next/link'
import { FaUser, FaStar, FaCommentAlt } from 'react-icons/fa'
import { FaRegClock, FaLink } from 'react-icons/fa6'
import Comment from './comment'
import LikeButton from './LikeButton'
import CommentEditor from './CommentEditor'
import UsernameLink from '@/components/username-link'

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

  const story = await HNApiService.getItemFromSource(
    storyId,
    isInternalStory ? 'Internal' : 'hackernews',
  )

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const tags = tagsQuery ? tagsQuery.split(',') : []
  const filteredTags = tags.filter((tag) =>
    ['story', 'ask_hn', 'show_hn', 'job', 'comment'].includes(tag),
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{story.title}</h1>
            {filteredTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filteredTags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <FaUser /> <UsernameLink username={story.author} /> {/* Changed here */}
            </span>
            {story.points && (
              <span className="flex items-center gap-1">
                <FaStar /> {story.points} points
              </span>
            )}
            <span className="flex items-center gap-1">
              <FaRegClock /> {formatDate(story.created_at_i)}
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
              <FaCommentAlt /> {story.children.length} Comments
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
