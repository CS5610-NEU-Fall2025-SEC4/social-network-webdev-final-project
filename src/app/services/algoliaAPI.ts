import { error } from 'console'
import { HNSearchResponse, HNStory, SearchParams } from '../types/types'

class HNAPIService {
  private readonly baseURLAlgoliaAPI: string = 'https://hn.algolia.com/api/v1'

  private buildQueryString(params: Record<string, string>): string {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (key !== undefined && value !== null) searchParams.append(key, value)
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
      console.log(err)
      throw error
    }
  }
  private async search(params: SearchParams): Promise<HNSearchResponse> {
    const searchParamsString = this.buildQueryString(params)
    return this.fetchAPI(`/search?${searchParamsString}`)
  }

  async getItem(id: number): Promise<HNStory> {
    return this.fetchAPI(`/items/${id}`)
  }
  async getFrontPage(storyType: string = '') {
    const tag_search = storyType !== '' ? `(${storyType})` : 'front_page'
    return this.search({ tags: tag_search })
  }
  async getTag(storyType: string) {
    return this.search({ tags: storyType })
  }
}

export const HNApiService = new HNAPIService()
