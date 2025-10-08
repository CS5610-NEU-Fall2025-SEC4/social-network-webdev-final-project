import { randomUUID } from 'crypto'
import { ListGroupItem } from 'react-bootstrap'

export default function SearchResults() {
  const searchResults = []
  for (let i: number = 0; i < 100; i++) {
    searchResults.push(
      <ListGroupItem className="m-1 p-1" key={randomUUID()}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque itaque tenetur facere
        sapiente nostrum officiis esse hic provident ad aspernatur nobis, minus fugit ea,
        consectetur rerum laborum modi! Sapiente, qui!
      </ListGroupItem>,
    )
  }

  return <ListGroupItem>{...searchResults}</ListGroupItem>
}
