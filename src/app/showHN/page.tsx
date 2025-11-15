import SearchResults from '../search/components/search-results'
import { HNApiService } from '../services/algoliaAPI'
export default async function ShowHN() {
  const stories = await HNApiService.getTag('show_hn')
  return (
    <div>
      <SearchResults stories={stories.hits} />
    </div>
  )
}
