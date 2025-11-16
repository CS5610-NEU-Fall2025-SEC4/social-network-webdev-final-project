import { HNSearchResponse, HNStory, SearchParams } from '../types/types'

class HNAPIService {
  private readonly baseURLAlgoliaAPI: string =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  private buildQueryString(params: SearchParams): string {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') searchParams.append(key, value)
    })
    return searchParams.toString()
  }
  private async fetchAPI<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURLAlgoliaAPI}${endpoint}`)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  async search(params: SearchParams): Promise<HNSearchResponse> {
    const qs = this.buildQueryString(params)
    return this.fetchAPI(`/search?${qs}`)
  }

  async getItem(id: number): Promise<HNStory> {
    return this.fetchAPI(`/items/${id}`)
  }
  async getFrontPage(storyType: string) {
    const suffix =
      storyType && storyType !== '' ? `?storyType=${encodeURIComponent(storyType)}` : ''
    return this.fetchAPI(`/front-page${suffix}`)
  }
  async getTag(storyType: string) {
    return this.fetchAPI(`/tag/${encodeURIComponent(storyType)}`)
  }
}

export const HNApiService = new HNAPIService()
