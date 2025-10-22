import SearchResults from '../search/components/search-results'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HNApiService } from '../services/algoliaAPI'
import { Container } from 'react-bootstrap'
export default async function ShowHN() {
  const stories = await HNApiService.getTag('show_hn')
  return (
    <Container>
      <SearchResults stories={stories.hits} />
    </Container>
  )
}
