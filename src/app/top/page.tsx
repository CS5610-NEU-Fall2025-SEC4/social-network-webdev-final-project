import SearchResults from '../search/components/search-results'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HNApiService } from '../services/algoliaAPI'
export default async function TopStories() {
  const stories = await HNApiService.getFrontPage('story')
  return (
    <Container>
      <SearchResults stories={stories.hits} />
    </Container>
  )
}
