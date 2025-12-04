const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const reportBaseUrl = `${base}/report`

export interface Report {
  id: string
  contentId: string
  contentType: 'story' | 'comment'
  reportedBy: {
    id: string
    username: string
    email: string
  }
  reason: string
  status: 'pending' | 'reviewed' | 'dismissed'
  createdAt: string
  reviewedAt?: string
  reviewedBy?: {
    id: string
    username: string
  }
  contentAuthor: string
  contentAuthorId?: string
  content?: {
    id: string
    title?: string
    text?: string
    author: string
  } | null
}

export interface CreateReportPayload {
  contentId: string
  contentType: 'story' | 'comment'
  reason: string
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

export async function reportStory(
  contentId: string,
  reason: string,
  contentType: 'story' | 'comment',
  token: string,
): Promise<Report> {
  const res = await fetch(reportBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contentId,
      contentType,
      reason,
    }),
  })
  return handleResponse<Report>(res)
}

export async function getAllReports(token: string): Promise<Report[]> {
  const res = await fetch(reportBaseUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse<Report[]>(res)
}

export async function getReportsByStatus(
  status: 'pending' | 'reviewed' | 'dismissed',
  token: string,
): Promise<Report[]> {
  const res = await fetch(`${reportBaseUrl}/status/${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse<Report[]>(res)
}

export async function getReportsByContentId(contentId: string, token: string): Promise<Report[]> {
  const res = await fetch(`${reportBaseUrl}/content/${contentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse<Report[]>(res)
}

export async function updateReportStatus(
  reportId: string,
  status: 'reviewed' | 'dismissed',
  token: string,
): Promise<Report> {
  const res = await fetch(`${reportBaseUrl}/${reportId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })
  return handleResponse<Report>(res)
}

export async function deleteReport(reportId: string, token: string): Promise<void> {
  const res = await fetch(`${reportBaseUrl}/${reportId}`, {
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
