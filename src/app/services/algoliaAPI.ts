import { error } from 'console'
import { HNSearchResponse, HNStory, SearchParams } from '../types/types'

class HNAPIService {
  private readonly baseURLAlgoliaAPI: string = 'https://hn.algolia.com/api/v1'

  private buildQueryString(params: SearchParams): string {
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
  async search(params: SearchParams): Promise<HNSearchResponse> {
    const search_params = new SearchParams()
    search_params.query =
      params?.query !== '' && params?.query !== undefined && params?.query !== null
        ? params.query
        : ''
    search_params.hitsPerPage =
      params?.hitsPerPage !== '' &&
      params?.hitsPerPage !== undefined &&
      params?.hitsPerPage !== null
        ? params.hitsPerPage
        : '30'
    search_params.tags =
      params?.tags !== '' && params?.tags !== undefined && params?.tags !== null
        ? params.tags
        : 'front_page'
    search_params.page =
      params?.page !== '' && params?.page !== undefined && params?.page !== null ? params.page : '0'
    search_params.numericFilters =
      params?.numericFilters !== '' &&
      params?.numericFilters !== undefined &&
      params?.numericFilters !== null
        ? params.numericFilters
        : ''
    const searchParamsString = this.buildQueryString(search_params)
    return this.fetchAPI(`/search?${searchParamsString}`)
  }

  async getItem(id: number): Promise<HNStory> {
    return this.fetchAPI(`/items/${id}`)
  }
  async getFrontPage(storyType: string) {
    const tag_search = storyType !== '' ? `(front_page,${storyType})` : 'front_page'
    return this.search({ tags: tag_search, hitsPerPage: '10' })
  }
  async getTag(storyType: string) {
    return this.search({ tags: storyType })
  }
}

export const HNApiService = new HNAPIService()
