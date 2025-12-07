import { HNStory } from '@/app/types/types'
import StoryComponent from '../components/story-component'

export default async function SearchResults({ stories }: { stories: HNStory[] }) {
  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <StoryComponent key={story.objectID || story.id} story={story} />
      ))}
    </div>
  )
}
