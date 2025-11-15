import SearchFilter from './components/search-filter'
import SearchResults from './components/search-results'
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
  const results = await HNApiService.search(search_params)

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
