import SearchResults from '../search/components/search-results'
import { HNApiService } from '../services/algoliaAPI'

export const dynamic = 'force-dynamic'

export default async function AskHN() {
  const stories = await HNApiService.getTag('ask_hn')
  return (
    <div>
      <SearchResults stories={stories.hits} />
    </div>
  )
}
