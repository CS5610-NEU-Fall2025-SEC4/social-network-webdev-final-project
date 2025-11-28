const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface DashboardStats {
  overview: {
    totalUsers: number
    totalStories: number
    totalComments: number
    totalJobs: number
    activeUsers: number
    blockedUsers: number
  }
  growth: {
    users: {
      today: number
      thisWeek: number
      thisMonth: number
      lastMonth: number
      percentChange: string
    }
    stories: {
      today: number
      thisWeek: number
      thisMonth: number
      lastMonth: number
      percentChange: string
    }
    comments: {
      today: number
      thisWeek: number
      thisMonth: number
      lastMonth: number
      percentChange: string
    }
    jobs: {
      thisMonth: number
      lastMonth: number
      percentChange: string
    }
  }
  userBreakdown: {
    byRole: {
      USER?: number
      EMPLOYER?: number
      ADMIN?: number
    }
  }
  contentBreakdown: {
    stories: {
      total: number
      active: number
      deleted: number
      byType: {
        story?: number
        job?: number
        askHN?: number
        showHN?: number
      }
    }
    comments: {
      total: number
      active: number
      deleted: number
    }
  }
  moderation: {
    blockedUsers: number
    blockedEmails: number
    deletionsToday: number
    deletionsThisWeek: number
    deletionsThisMonth: number
  }
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
  return res.json() as Promise<T>
}

export async function getDashboardStats(token: string): Promise<DashboardStats> {
  const res = await fetch(`${base}/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse<DashboardStats>(res)
}

export async function getAllUsers(
  token: string,
  params?: {
    page?: number
    limit?: number
    role?: string
    isBlocked?: boolean
  },
) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.limit) query.append('limit', params.limit.toString())
  if (params?.role) query.append('role', params.role)
  if (params?.isBlocked !== undefined) query.append('isBlocked', params.isBlocked.toString())

  const res = await fetch(`${base}/admin/users?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(res)
}

export async function blockUser(userId: string, token: string) {
  const res = await fetch(`${base}/admin/users/${userId}/block`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(res)
}

export async function unblockUser(userId: string, token: string) {
  const res = await fetch(`${base}/admin/users/${userId}/unblock`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(res)
}

export async function getBlockedEmails(token: string, page = 1, limit = 20) {
  const res = await fetch(`${base}/admin/emails/blocked?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(res)
}

export async function blockEmail(email: string, reason: string, token: string) {
  const res = await fetch(`${base}/admin/emails/block`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, reason }),
  })
  return handleResponse(res)
}

export async function unblockEmail(email: string, token: string) {
  const res = await fetch(`${base}/admin/emails/${email}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(res)
}
