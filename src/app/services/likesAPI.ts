const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const likeBaseUrl = `${base}/likes`

export interface LikeStatusResponse {
  likeCount: number
  totalPoints: number
  isLiked: boolean
}

export interface ToggleLikeResponse {
  liked: boolean
  totalPoints: number
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

export async function toggleLike(
  itemId: string,
  itemType: 'story' | 'comment',
  token: string,
  originalPoints: number = 0,
): Promise<ToggleLikeResponse> {
  const res = await fetch(
    `${likeBaseUrl}/${itemId}/toggle?type=${itemType}&originalPoints=${originalPoints}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return handleResponse<ToggleLikeResponse>(res)
}

export async function getLikeStatus(
  itemId: string,
  itemType: 'story' | 'comment',
  username?: string,
  originalPoints: number = 0,
): Promise<LikeStatusResponse> {
  const usernameParam = username ? `&username=${encodeURIComponent(username)}` : ''
  const res = await fetch(
    `${likeBaseUrl}/${itemId}/status?type=${itemType}&originalPoints=${originalPoints}${usernameParam}`,
  )
  return handleResponse<LikeStatusResponse>(res)
}

export async function getMyLikes(token: string): Promise<string[]> {
  const res = await fetch(`${likeBaseUrl}/user/my-likes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse<string[]>(res)
}
