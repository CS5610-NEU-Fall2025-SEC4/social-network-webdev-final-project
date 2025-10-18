import { Col, Container, Row } from 'react-bootstrap'
import SearchFilter from './components/search-filter'
import SearchBar from './components/search-bar'
import SearchResults from './components/search-results'
import 'bootstrap/dist/css/bootstrap.min.css'
export default function SearchPage() {
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
          <Row>
            <SearchResults />
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
