import SearchResults from '../search/components/search-results'
import { HNApiService } from '../services/algoliaAPI'

export const dynamic = 'force-dynamic'

export default async function TopStories() {
  const stories = await HNApiService.getFrontPage('story')
  return (
    <div>
      <SearchResults stories={stories.hits} />
    </div>
  )
}
