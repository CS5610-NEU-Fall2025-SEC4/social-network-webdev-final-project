'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { getDashboardStats, DashboardStats } from '@/app/services/adminAPI'
import { getReportsByStatus } from '@/app/services/reportAPI'
import StatsCard from '../components/StatsCard'
import { FaUsers, FaFileAlt, FaComments, FaBriefcase, FaFlag, FaUserSlash } from 'react-icons/fa'

export default function AdminDashboardPage() {
  const { token } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pendingReports, setPendingReports] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        setLoading(true)
        const [dashStats, reports] = await Promise.all([
          getDashboardStats(token),
          getReportsByStatus('pending', token),
        ])

        setStats(dashStats)
        setPendingReports(reports.length)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to load dashboard stats')
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const getChangeType = (change: string): 'increase' | 'decrease' | 'neutral' => {
    const num = parseFloat(change)
    if (num > 0) return 'increase'
    if (num < 0) return 'decrease'
    return 'neutral'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your platform&apos;s key metrics and activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.overview.totalUsers}
          change={`${stats.growth.users.percentChange}%`}
          changeType={getChangeType(stats.growth.users.percentChange)}
          icon={<FaUsers />}
          subtitle="vs last month"
        />
        <StatsCard
          title="Total Posts"
          value={stats.overview.totalStories}
          change={`${stats.growth.stories.percentChange}%`}
          changeType={getChangeType(stats.growth.stories.percentChange)}
          icon={<FaFileAlt />}
          subtitle="vs last month"
        />
        <StatsCard
          title="Total Comments"
          value={stats.overview.totalComments}
          change={`${stats.growth.comments.percentChange}%`}
          changeType={getChangeType(stats.growth.comments.percentChange)}
          icon={<FaComments />}
          subtitle="vs last month"
        />
        <StatsCard
          title="Job Postings"
          value={stats.overview.totalJobs}
          change={`${stats.growth.jobs.percentChange}%`}
          changeType={getChangeType(stats.growth.jobs.percentChange)}
          icon={<FaBriefcase />}
          subtitle="vs last month"
        />
        <StatsCard
          title="Pending Reports"
          value={pendingReports}
          icon={<FaFlag />}
          subtitle="needs review"
        />
        <StatsCard
          title="Blocked Users"
          value={stats.overview.blockedUsers}
          icon={<FaUserSlash />}
          subtitle="currently blocked"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Breakdown by Role</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Regular Users</span>
              <span className="font-semibold text-gray-900">
                {stats.userBreakdown.byRole.USER || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employers</span>
              <span className="font-semibold text-gray-900">
                {stats.userBreakdown.byRole.EMPLOYER || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admins</span>
              <span className="font-semibold text-gray-900">
                {stats.userBreakdown.byRole.ADMIN || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Posts</span>
              <span className="font-semibold text-green-600">
                {stats.contentBreakdown.stories.active}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Deleted Posts</span>
              <span className="font-semibold text-red-600">
                {stats.contentBreakdown.stories.deleted}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Comments</span>
              <span className="font-semibold text-green-600">
                {stats.contentBreakdown.comments.active}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Deleted Comments</span>
              <span className="font-semibold text-red-600">
                {stats.contentBreakdown.comments.deleted}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity (This Month)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">New Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.growth.users.thisMonth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">New Posts</p>
            <p className="text-2xl font-bold text-gray-900">{stats.growth.stories.thisMonth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">New Comments</p>
            <p className="text-2xl font-bold text-gray-900">{stats.growth.comments.thisMonth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Deletions</p>
            <p className="text-2xl font-bold text-red-600">{stats.moderation.deletionsThisMonth}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
