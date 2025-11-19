export type StoryType = 'story' | 'comment' | 'job' | 'poll' | 'pollopt'

export type HNStory = {
  author: string
  children: number[]
  created_at: string
  created_at_i: number
  id: number
  options: unknown[]
  parent_id: number | null
  points: number
  story_id: number
  text: string | null
  comment_text: string | null
  title: string
  type: StoryType
  url: string
  _tags: string[]
}

export type HNUser = {
  username: string
  about?: string
  karma: string
}

export type HNSearchResponse = {
  hits: HNStory[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  exhaustiveNbHits: boolean
  exhaustiveTypo: boolean
  query: string
  params: string
  processingTimeMS: number
}

export type SearchParams = {
  query?: string
  tags?: string
  page?: string
  sort?: string
  hitsPerPage?: string
  numericFilters?: string
}
