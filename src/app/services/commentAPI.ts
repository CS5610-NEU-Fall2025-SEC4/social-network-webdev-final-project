import { HNStory } from '../types/types'

const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const commentBaseUrl = `${base}/comment`

export type Comment = HNStory

export interface CreateCommentPayload {
  text: string
  story_id: string
  parent_id?: string
}

export interface UpdateCommentPayload {
  text: string
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

export async function createComment(
  payload: CreateCommentPayload,
  token: string,
): Promise<Comment> {
  const res = await fetch(commentBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<Comment>(res)
}

export async function getCommentById(commentId: string): Promise<Comment> {
  const res = await fetch(`${commentBaseUrl}/${commentId}`)
  return handleResponse<Comment>(res)
}

export async function updateComment(
  commentId: string,
  payload: UpdateCommentPayload,
  token: string,
): Promise<Comment> {
  const res = await fetch(`${commentBaseUrl}/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<Comment>(res)
}

export async function deleteComment(commentId: string, token: string): Promise<void> {
  const res = await fetch(`${commentBaseUrl}/${commentId}`, {
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
