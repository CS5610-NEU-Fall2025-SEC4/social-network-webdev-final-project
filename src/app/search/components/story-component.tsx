import { HNStory } from '@/app/types/types'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StoryComponent({ story }: { story: HNStory }) {
  const isStory = story._tags?.includes('story') || story.type === 'story'
  const isAskHN = story._tags?.includes('ask_hn')
  const isShowHN = story._tags?.includes('show_hn')
  const isJob = story._tags?.includes('job')
  const isComment = story._tags?.includes('comment') || story.type === 'comment'

  const getLinkText = () => {
    if (isJob) {
      return '(View Job Listing)'
    }
    if (isStory) {
      return '(Visit the Post)'
    }
    return '(Visit the Link)'
  }

  return (
    <Card className="shadow-sm mb-4 transition-transform transform hover:-translate-y-1 hover:shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="mb-2 text-lg font-semibold">
          {isComment ? (
            <div
              dangerouslySetInnerHTML={{ __html: story.comment_text ?? '' }}
              className="text-gray-800"
            />
          ) : story.url ? (
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
          {story.url && !isComment && (
            <Link className="ml-2 text-gray-500 hover:underline" href={story.url}>
              <small className="text-gray-500">{getLinkText()}</small>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div>
            <span className="font-bold">{story.points}</span> points
          </div>
          <span>•</span>
          <div>by {story.author}</div>
          <span>•</span>
          <div>relative date</div>
          {(isStory || isAskHN || isShowHN) && (story.children || []).length > 0 && (
            <>
              <span>•</span>
              <div>{story.children.length} comments</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
