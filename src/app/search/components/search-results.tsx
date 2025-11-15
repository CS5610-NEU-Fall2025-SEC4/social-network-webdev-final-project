import { HNStory } from '@/app/types/types'
import StoryComponent from './story-component'

export default async function SearchResults({ stories }: { stories: HNStory[] }) {
  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <StoryComponent key={story.created_at_i} story={story} />
      ))}
    </div>
  )
}
