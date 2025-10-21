import { HNStory, StoryType } from '@/app/types/types'
import { randomInt, randomUUID } from 'crypto'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import StoryComponent from './story-component'
import { HNApiService } from '@/app/services/algoliaAPI'
import { ReactNode } from 'react'

export default async function SearchResults({ stories }: { stories: HNStory[] }) {
  return (
    <ListGroup>
      {stories.map((story) => (
        <ListGroupItem className="m-1 p-0 border-0" key={story.created_at_i}>
          <StoryComponent story={story} />
        </ListGroupItem>
      ))}
    </ListGroup>
  )
}
