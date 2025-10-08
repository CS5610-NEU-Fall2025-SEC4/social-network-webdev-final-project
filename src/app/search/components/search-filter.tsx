import { FormControl, FormLabel, FormSelect } from 'react-bootstrap'

export default function SearchFilter() {
  return (
    <div>
      <h4>Filter</h4>
      <FormLabel id="hn-category" aria-label="HN Category Filter Label">
        Choose Category
      </FormLabel>
      <FormSelect id="hn-category" aria-label="HN Category Filter">
        <option value="HN-ASK">Ask Hacker News</option>
        <option value="HN-SHOW">Show Hacker News</option>
        <option value="HN-POST">Post</option>
        <option value="HN-COMMENT">Comment</option>
      </FormSelect>
      <FormLabel id="hn-relevance" aria-label="HN Relevance Label">
        Relevance
      </FormLabel>
      <FormSelect id="hn-relevance" aria-label="HN Category Filter">
        <option value="HN-ASK">Most Relevant</option>
        <option value="HN-SHOW">Most Recent</option>
      </FormSelect>
      <FormLabel id="hn-category" aria-label="HN Category Filter Label">
        Sort By
      </FormLabel>
      <FormSelect id="hn-category" aria-label="HN Category Filter">
        <option value="HN-ASK">Karma</option>
        <option value="HN-SHOW">Posting Time</option>
        <option value="HN-POST">Interactions</option>
      </FormSelect>{' '}
      <FormLabel htmlFor="hn-result-set" aria-label="Total Results">
        Total Results
      </FormLabel>
      <FormControl
        id="hn-result-set"
        size="lg"
        type="number"
        defaultValue={100}
        placeholder="Results"
      />
    </div>
  )
}
