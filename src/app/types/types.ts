export type StoryType = 'story' | 'comment' | 'job' | 'poll' | 'pollopt' | 'askHN' | 'showHN'

export type HNStory = {
  objectID?: number
  author: string
  children: (number | string)[]
  created_at: string
  created_at_i: number
  id: number | string
  options: unknown[]
  parent_id: number | string | null
  points: number
  story_id: number | string
  text: string | null
  comment_text: string | null
  title: string | null
  type: StoryType
  url: string | null
  _tags: string[]
}

export type HNStoryItem = {
  objectID?: number
  author: string
  children: HNStoryItem[]
  created_at: string
  created_at_i: number
  id: number | string
  options: unknown[]
  parent_id: number | string | null
  points: number
  story_id: number | string
  text: string | null
  comment_text: string | null
  title: string | null
  type: StoryType
  url: string | null
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
  time?: string
}
