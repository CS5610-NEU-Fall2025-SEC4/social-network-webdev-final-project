'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Form, Row, Col, Accordion } from 'react-bootstrap'
import { FormEvent, useState } from 'react'
import { BsFilter } from 'react-icons/bs'

export default function SearchBarWithFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') || '')

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== '') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '0')
    router.push(`/search?${params.toString()}`)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set('query', query)
    } else {
      params.delete('query')
    }
    params.set('page', '0')
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set('query', query)
    router.push(`/search?${params.toString()}`)
  }

  const hasFilters =
    searchParams.get('category') ||
    searchParams.get('sort') ||
    searchParams.get('time') ||
    searchParams.get('hitsPerPage')

  return (
    <div className="mb-4">
      <Form onSubmit={handleSubmit}>
        <div className="d-flex mb-3">
          <Form.Control
            type="text"
            placeholder="🔍 Search Hacker News stories, comments, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="lg"
          />
          <Button type="submit" variant="primary" className="ms-2 px-4">
            Search
          </Button>
        </div>
        <Row className="g-2 mb-2">
          <Col md={3} sm={6}>
            <Form.Select
              size="sm"
              value={searchParams.get('tags') || 'story'}
              onChange={(e) => updateFilter('tags', e.target.value)}
            >
              <option value="story">Stories</option>
              <option value="ask_hn">Ask HN</option>
              <option value="show_hn">Show HN</option>
              <option value="comment">Comments</option>
              <option value="job">Jobs</option>
            </Form.Select>
          </Col>

          <Col md={3} sm={6}>
            <Form.Select
              size="sm"
              
              defaultValue={''}
              // onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="search">Most Relevant</option>
              <option value="search_by_date">Most Recent</option>
            </Form.Select>
          </Col>

          <Col md={3} sm={6}>
            <Form.Select
              size="sm"
              
              defaultValue={''}
              // onChange={(e) => updateFilter('time', e.target.value)}
            >
              <option value="">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </Form.Select>
          </Col>

          <Col md={3} sm={6}>
            <Form.Select
              size="sm"
              value={searchParams.get('hitsPerPage') || '30'}
              onChange={(e) => updateFilter('hitsPerPage', e.target.value)}
            >
              <option value="10">10 per page</option>
              <option value="30">30 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </Form.Select>
          </Col>
        </Row>

        {}
        {hasFilters && (
          <div className="text-end">
            <Button
              variant="link"
              size="sm"
              onClick={clearFilters}
              className="text-decoration-none"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </Form>
    </div>
  )
}
