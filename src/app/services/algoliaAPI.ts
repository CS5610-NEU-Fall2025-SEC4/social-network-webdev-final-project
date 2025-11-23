import { HNSearchResponse, HNStoryItem, SearchParams } from '../types/types'
import { getCommentsByStoryId } from './commentAPI'

class HNAPIService {
  private readonly backendBase: string | undefined =
    process.env.NEXT_PUBLIC_HN_PROXY_URL || process.env.NEXT_PUBLIC_API_URL
  private readonly directBase = 'https://hn.algolia.com/api/v1'
  private get activeBase(): string {
    return this.backendBase || this.directBase
  }
  private get usingDirect(): boolean {
    return !this.backendBase || this.activeBase.includes('hn.algolia.com')
  }

  private buildQueryString(params: SearchParams): string {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') searchParams.append(key, value)
    })
    return searchParams.toString()
  }
  private async fetchAPI<T>(endpoint: string): Promise<T> {
    const url = `${this.activeBase}${endpoint}`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return (await response.json()) as T
    } catch (err) {
      if (!this.usingDirect) {
        console.warn('HNAPIService: backend fetch failed, falling back to direct Algolia API.', err)
        const directUrl = `${this.directBase}${endpoint}`
        const resp = await fetch(directUrl)
        if (!resp.ok) throw err
        return (await resp.json()) as T
      }
      console.error('HNAPIService fetch failed:', err)
      throw err
    }
  }
  async search(params: SearchParams): Promise<HNSearchResponse> {
    const qs = this.buildQueryString(params)
    return this.fetchAPI(`/search?${qs}`)
  }

  async getLocalItem(id: string): Promise<HNStoryItem> {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
    if (!backendUrl) {
      throw new Error('Backend URL not configured')
    }
    const url = `${backendUrl}/story/${id}/full`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }

  async getItemFromSource(
    id: number | string,
    source: 'hackernews' | 'Internal' = 'hackernews',
  ): Promise<HNStoryItem> {
    if (source === 'Internal') {
      return this.getLocalItem(String(id))
    }
    return this.getItem(Number(id))
  }

  async getItem(id: number): Promise<HNStoryItem> {
    const algoliaStory = await this.fetchAPI<HNStoryItem>(`/items/${id}`)
    try {
      const mongoComments = await getCommentsByStoryId(String(id))

      if (mongoComments && mongoComments.length > 0) {
        const algoliaChildren = Array.isArray(algoliaStory.children)
          ? (algoliaStory.children as HNStoryItem[])
          : []

        algoliaStory.children = [...algoliaChildren, ...mongoComments]
      }
    } catch (error) {
      console.warn('Failed to fetch MongoDB comments for Algolia story:', error)
    }

    return algoliaStory
  }

  async getFrontPage(storyType: string) {
    if (this.usingDirect) {
      const tagSearch = storyType && storyType !== '' ? `(front_page,${storyType})` : 'front_page'
      const qs = this.buildQueryString({ tags: tagSearch, hitsPerPage: '10' })
      return this.fetchAPI<HNSearchResponse>(`/search?${qs}`)
    }
    const suffix =
      storyType && storyType !== '' ? `?storyType=${encodeURIComponent(storyType)}` : ''
    return this.fetchAPI<HNSearchResponse>(`/front-page${suffix}`)
  }
  async getTag(storyType: string): Promise<HNSearchResponse> {
    if (this.usingDirect) {
      const qs = this.buildQueryString({ tags: storyType })
      return this.fetchAPI<HNSearchResponse>(`/search?${qs}`)
    }
    return this.fetchAPI<HNSearchResponse>(`/tag/${encodeURIComponent(storyType)}`)
  }
}

export const HNApiService = new HNAPIService()
