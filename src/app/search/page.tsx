import SearchFilter from '../components/search-filter'
import SearchResults from '../components/search-results'
import { HNApiService } from '../services/algoliaAPI'
import { SearchParams } from '../types/types'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const search_params = await searchParams
  const processedParams: SearchParams = { ...search_params }
  const { time } = processedParams

  if (time && time !== 'all') {
    const now = Math.floor(Date.now() / 1000)
    let secondsAgo = 0

    switch (time) {
      case 'hour':
        secondsAgo = 60 * 60
        break
      case '24h':
        secondsAgo = 24 * 60 * 60
        break
      case 'week':
        secondsAgo = 7 * 24 * 60 * 60
        break
      case 'month':
        secondsAgo = 30 * 24 * 60 * 60
        break
      case '6months':
        secondsAgo = 6 * 30 * 24 * 60 * 60
        break
      case 'year':
        secondsAgo = 365 * 24 * 60 * 60
        break
    }

    if (secondsAgo > 0) {
      processedParams.numericFilters = `created_at_i>${now - secondsAgo}`
    }
  }
  delete processedParams.time

  const results = await HNApiService.search(processedParams)

  return (
    <div className="container mx-auto py-8">
      <SearchFilter />
      {results.hits.length === 0 ? (
        <div className="text-center text-muted-foreground py-10 border border-gray-200 rounded-lg bg-gray-50 mt-8">
          <h4 className="text-xl font-semibold mb-2">No results found</h4>
          <p className="text-base">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="text-muted-foreground mb-4 text-sm">
            {results.nbHits.toLocaleString()} results ({results.processingTimeMS}
            ms)
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults stories={results.hits} />
          </Suspense>
        </>
      )}
    </div>
  )
}
