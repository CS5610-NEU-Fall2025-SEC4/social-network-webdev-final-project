import { Button, Col, Form, Row } from 'react-bootstrap'
import { BsPlus } from 'react-icons/bs'

export default function SearchBar() {
  return (
    <Form>
      <div className="d-flex justify-content around">
        <Form.Control type="text" placeholder="🔍 Search for Assignments" />
        <Button variant="success" className="p-2 ms-2 rounded w-20">
          {' '}
          Search
        </Button>
      </div>
    </Form>
  )
}
