'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Tags, ListFilter, Clock, List } from 'lucide-react'

export default function SearchBarWithFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') || '')

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
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
    searchParams.get('tags') ||
    searchParams.get('sort') ||
    searchParams.get('time') ||
    searchParams.get('hitsPerPage')

  return (
    <div className="mb-8 p-4 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full items-center space-x-2 mb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Hacker News stories, comments, and more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-lg pl-10 py-6 rounded-full shadow-inner"
            />
          </div>
          <Button type="submit" className="px-6 py-6 rounded-full">
            <Search className="h-4 m-2" /> Search
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Tags className="h-4 w-4 text-gray-500" />
            <Select
              value={searchParams.get('tags') || 'story'}
              onValueChange={(value) => updateFilter('tags', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="story">Stories</SelectItem>
                <SelectItem value="ask_hn">Ask HN</SelectItem>
                <SelectItem value="show_hn">Show HN</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
                <SelectItem value="job">Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <ListFilter className="h-4 w-4 text-gray-500" />
            <Select
              value={searchParams.get('sort') || 'search'}
              onValueChange={(value) => updateFilter('sort', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Most Relevant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search">Most Relevant</SelectItem>
                <SelectItem value="search_by_date">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Select
              value={searchParams.get('time') || 'all'}
              onValueChange={(value) => updateFilter('time', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <List className="h-4 w-4 text-gray-500" />
            <Select
              value={searchParams.get('hitsPerPage') || '30'}
              onValueChange={(value) => updateFilter('hitsPerPage', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Results per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="30">30 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              type="button"
              className="text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
