import SearchResults from '../search/components/search-results'
import { HNApiService } from '../services/algoliaAPI'

export const dynamic = 'force-dynamic'

export default async function AskHN() {
  try {
    const stories = await HNApiService.getTag('ask_hn')

    if (!stories || !stories.hits || stories.hits.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No Ask HN posts found.</p>
          <p className="text-gray-400 text-sm mt-2">Be the first to ask a question!</p>
        </div>
      )
    }

    return (
      <div>
        <SearchResults stories={stories.hits} />
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch Ask HN posts:', error)
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700 font-medium text-lg mb-2">Failed to load Ask HN posts</p>
          <p className="text-red-600 text-sm">
            {error instanceof Error ? error.message : 'An error occurred while fetching posts.'}
          </p>
          <p className="text-gray-600 text-sm mt-3">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }
}
