import { Col, Container, Row } from 'react-bootstrap'
import SearchFilter from './components/search-filter'
import SearchBar from './components/search-bar'
import SearchResults from './components/search-results'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HNApiService } from '../services/algoliaAPI'
export default async function SearchPage() {
  const stories = [await HNApiService.getItem(1)]
  return (
    <Container className="m-2 p-2">
      <Row>
        <Col xxl={3}>
          <SearchFilter />
        </Col>
        <Col xxl={9}>
          <Row>
            <SearchBar />
          </Row>
          <Row>{<SearchResults stories={stories} />}</Row>
        </Col>
      </Row>
    </Container>
  )
}
