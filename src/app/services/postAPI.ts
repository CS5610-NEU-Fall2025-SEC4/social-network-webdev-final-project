import { HNStory } from '../types/types'

const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const storyBaseUrl = `${base}/story`

export type Story = HNStory

export interface CreateStoryPayload {
  title: string
  type: 'story' | 'job' | 'askHN' | 'showHN'
  text?: string
  url?: string
  points?: number
  children?: string[]
  _tags?: string[]
}

export interface UpdateStoryPayload {
  title?: string
  text?: string
  url?: string
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `An error occurred: ${res.statusText}`
    try {
      const data = await res.json()
      if (data?.message) {
        message = Array.isArray(data.message) ? data.message.join(', ') : data.message
      }
    } catch (_e) {}
    throw new Error(message)
  }
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return res.json() as Promise<T>
  }
  return undefined as T
}

export async function createStory(payload: CreateStoryPayload, token: string): Promise<Story> {
  const res = await fetch(storyBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<Story>(res)
}

export async function getAllStories(): Promise<Story[]> {
  const res = await fetch(storyBaseUrl)
  return handleResponse<Story[]>(res)
}

export async function getStoriesByType(type: string): Promise<Story[]> {
  const res = await fetch(`${storyBaseUrl}/type/${type}`)
  return handleResponse<Story[]>(res)
}

export async function getStoryById(storyId: string): Promise<Story> {
  const res = await fetch(`${storyBaseUrl}/${storyId}`)
  return handleResponse<Story>(res)
}

export async function updateStory(
  storyId: string,
  payload: UpdateStoryPayload,
  token: string,
): Promise<Story> {
  const res = await fetch(`${storyBaseUrl}/${storyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<Story>(res)
}

export async function deleteStory(storyId: string, token: string): Promise<void> {
  const res = await fetch(`${storyBaseUrl}/${storyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    let message = `An error occurred: ${res.statusText}`
    try {
      const data = await res.json()
      if (data?.message) {
        message = Array.isArray(data.message) ? data.message.join(', ') : data.message
      }
    } catch (_e) {}
    throw new Error(message)
  }
}
