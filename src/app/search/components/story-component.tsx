import { HNStory } from '@/app/types/types'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import UsernameLink from '@/components/username-link'
import BookmarkClient from './BookmarkClient'

export default function StoryComponent({ story }: { story: HNStory }) {
  const isStory = story._tags?.includes('story') || story.type === 'story'
  const isAskHN = story._tags?.includes('ask_hn')
  const isShowHN = story._tags?.includes('show_hn')
  const isJob = story._tags?.includes('job')
  const isComment = story._tags?.includes('comment') || story.type === 'comment'

  const getLinkText = () => {
    if (isJob) return '(View Job Listing)'
    if (isStory) return '(Visit the Post)'
    return '(Visit the Link)'
  }

  const storyTags = story._tags?.filter(
    (tag) => !tag.startsWith('author_') && !tag.startsWith('story_'),
  )

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const secondsAgo = Math.floor((now - timestamp * 1000) / 1000)

    if (secondsAgo < 60) return 'just now'
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`
    if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 86400)} days ago`
    if (secondsAgo < 31536000) return `${Math.floor(secondsAgo / 2592000)} months ago`
    return `${Math.floor(secondsAgo / 31536000)} years ago`
  }

  const isLocalStory = isNaN(Number(story.story_id))

  const itemId: string = String(
    isLocalStory ? (story.story_id ?? story.objectID) : (story.objectID ?? story.story_id),
  )

  return (
    <Card className="shadow-sm mb-4 transition-transform transform hover:-translate-y-1 hover:shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="mb-2 text-lg font-semibold">
          {isComment ? (
            <div
              dangerouslySetInnerHTML={{ __html: story.comment_text ?? '' }}
              className="text-gray-800"
            />
          ) : (
            <span className="inline-flex items-center gap-2">
              {story.url ? (
                <Link
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:underline"
                >
                  {story.title}
                </Link>
              ) : (
                story.title
              )}
              {!isComment && (
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/details/${
                      isLocalStory ? story.story_id : story.objectID
                    }?tags=${encodeURIComponent(storyTags?.join(',') || '')}`}
                  >
                    {getLinkText()}
                  </Link>
                </Button>
              )}
            </span>
          )}

          {isComment && (
            <div className="mt-2">
              <BookmarkClient itemId={itemId} />
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div>
            <span className="font-bold">{story.points}</span> points
          </div>
          <span>•</span>
          <div>
            by <UsernameLink username={story.author} />
          </div>
          <span>•</span>
          <div>{getRelativeTime(story.created_at_i)}</div>
          {(isStory || isAskHN || isShowHN) && (story.children || []).length > 0 && (
            <>
              <span>•</span>
              <div>{story.children.length} comments</div>
            </>
          )}

          {!isComment && (
            <>
              <span>•</span>
              <div className="flex items-center">
                <BookmarkClient itemId={itemId} />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
