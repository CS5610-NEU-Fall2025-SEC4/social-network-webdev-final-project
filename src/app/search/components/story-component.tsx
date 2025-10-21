import { HNStory, StoryType } from '@/app/types/types'
import Link from 'next/link'
import { Card, CardBody, CardTitle, Stack } from 'react-bootstrap'
import { BsArrowUpCircle, BsChatDots, BsLink45Deg } from 'react-icons/bs'
import { CgLock } from 'react-icons/cg'

export default function StoryComponent({ story }: { story: HNStory }) {
  let template
  if (story._tags?.includes('ask_hn') && story._tags.includes('story')) {
    template = (
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle className="mb-2">
            {story.title}
            {story.url && (
              <Link className="ml-2 text-decoration-none" href={story.url}>
                <small className="text-muted">| ({story.url})</small>
              </Link>
            )}
          </CardTitle>

          <Stack direction="horizontal" gap={3} className="text-muted small">
            <div>
              <strong>{story.points}</strong> points
            </div>
            <div>by {story.author}</div>
            <div>
              {/* Add your relative date here */}
              relative date
            </div>
            <div>{story.children.length} comments</div>
          </Stack>
        </CardBody>
      </Card>
    )
  } else if (story._tags?.includes('show_hn') && story._tags.includes('story')) {
    template = (
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle className="mb-2">
            {story.title}
            {story.url && (
              <Link className="ml-2 text-decoration-none" href={story.url}>
                <small className="text-muted">| ({story.url})</small>
              </Link>
            )}
          </CardTitle>

          <Stack direction="horizontal" gap={3} className="text-muted small">
            <div>
              <strong>{story.points}</strong> points
            </div>
            <div>by {story.author}</div>
            <div>
              {/* Add your relative date here */}
              relative date
            </div>
            <div>{story.children.length} comments</div>
          </Stack>
        </CardBody>
      </Card>
    )
  } else if (story._tags?.includes('story') || story.type === 'story') {
    template = (
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle className="mb-2">
            <Link
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-dark"
            >
              {story.title}
            </Link>
            {story.url && (
              <Link className="ml-2 text-decoration-none" href={story.url}>
                <small className="text-muted">| ({story.url})</small>
              </Link>
            )}
          </CardTitle>

          <Stack direction="horizontal" gap={3} className="text-muted small">
            <div>
              <strong>{story.points}</strong> points
            </div>
            <div>by {story.author}</div>
            <div>
              {/* Add your relative date here */}
              relative date
            </div>
            <div>{story.children.length} comments</div>
          </Stack>
        </CardBody>
      </Card>
    )
  } else if (story._tags?.includes('comment') || story.type === 'comment') {
    template = (
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle className="mb-2">{story.comment_text}</CardTitle>

          <Stack direction="horizontal" gap={3} className="text-muted small">
            <div>
              <strong>{story.points}</strong> points
            </div>
            <div>by {story.author}</div>
            <div>
              {/* Add your relative date here */}
              relative date
            </div>
          </Stack>
        </CardBody>
      </Card>
    )
  }
  return template
}
