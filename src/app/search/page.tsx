import { Col, Container, Pagination, Row } from 'react-bootstrap'
import SearchFilter from './components/search-filter'
import SearchBar from './components/search-bar'
import SearchResults from './components/search-results'
import 'bootstrap/dist/css/bootstrap.min.css'
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
    <Container className="my-4">
      <SearchFilter />
      {results.hits.length === 0 ? (
        <div className="text-center text-muted py-5">
          <h4>No results found</h4>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="text-muted mb-3 small">
            {results.nbHits.toLocaleString()} results ({results.processingTimeMS}ms)
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults stories={results.hits} />
          </Suspense>
        </>
      )}
    </Container>
  )
}
