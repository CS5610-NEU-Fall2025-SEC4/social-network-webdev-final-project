import SearchResults from '../search/components/search-results'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HNApiService } from '../services/algoliaAPI'
import { Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
export default async function TopStories() {
  const stories = await HNApiService.getFrontPage()
  return (
    <Container>
      <SearchResults stories={stories.hits} />
    </Container>
  )
}
