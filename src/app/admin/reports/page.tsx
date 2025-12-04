'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
  getAllReports,
  getReportsByStatus,
  updateReportStatus,
  Report,
} from '@/app/services/reportAPI'
import { deleteStory } from '@/app/services/postAPI'
import { deleteComment } from '@/app/services/commentAPI'
import { blockUser } from '@/app/services/adminAPI'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FaFlag, FaCheckCircle, FaTimes, FaTrash, FaBan } from 'react-icons/fa'

export default function ReportsPage() {
  const { token } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('pending')

  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [actionType, setActionType] = useState<
    'approve' | 'dismiss' | 'delete-content' | 'block-author'
  >('approve')
  const [showDialog, setShowDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchReports = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      let data: Report[]
      if (statusFilter === 'all') {
        data = await getAllReports(token)
      } else {
        data = await getReportsByStatus(statusFilter as 'pending' | 'reviewed' | 'dismissed', token)
      }

      setReports(data as Report[])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load reports')
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [token, statusFilter])

  const handleAction = (report: Report, action: typeof actionType) => {
    setSelectedReport(report)
    setActionType(action)
    setShowDialog(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedReport || !token) return

    setActionLoading(true)
    setError(null)

    try {
      switch (actionType) {
        case 'approve':
          await updateReportStatus(selectedReport.id, 'reviewed', token)
          break

        case 'dismiss':
          await updateReportStatus(selectedReport.id, 'dismissed', token)
          break

        case 'delete-content':
          if (selectedReport.contentType === 'story') {
            await deleteStory(selectedReport.contentId, token)
          } else {
            await deleteComment(selectedReport.contentId, token)
          }
          await updateReportStatus(selectedReport.id, 'reviewed', token)
          break

        case 'block-author':
          if (selectedReport.contentAuthorId) {
            await blockUser(selectedReport.contentAuthorId, token)
            await updateReportStatus(selectedReport.id, 'reviewed', token)
          } else {
            throw new Error('Cannot block user: Author ID not available')
          }
          break
      }

      setShowDialog(false)
      setSelectedReport(null)
      await fetchReports()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const getActionTitle = () => {
    switch (actionType) {
      case 'approve':
        return 'Mark as Reviewed'
      case 'dismiss':
        return 'Dismiss Report'
      case 'delete-content':
        return 'Delete Content'
      case 'block-author':
        return 'Block Author'
    }
  }

  const getActionDescription = () => {
    switch (actionType) {
      case 'approve':
        return 'Mark this report as reviewed without taking action.'
      case 'dismiss':
        return 'Dismiss this report as invalid or not requiring action.'
      case 'delete-content':
        return 'Delete the reported content. This action cannot be undone.'
      case 'block-author':
        return 'Block the content author. All their posts and comments will be deleted.'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
        <p className="text-gray-600">Review and manage reported content</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-600">
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FaFlag className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No reports found</p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : report.status === 'reviewed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {report.status.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {report.contentType.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Reported by: {report.reportedBy.username}
                  </h3>
                  <p className="text-gray-700 mb-3">
                    <span className="font-medium">Reason:</span> {report.reason}
                  </p>
                </div>
              </div>

              {report.content && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">Content Author: </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {report.contentAuthor}
                    </span>
                  </div>
                  {report.content.title && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Title: </span>
                      <span className="text-sm text-gray-900">{report.content.title}</span>
                    </div>
                  )}
                  {report.content.text && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Content: </span>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {report.content.text.replace(/<[^>]*>/g, '').substring(0, 200)}...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {report.status === 'pending' && (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => handleAction(report, 'approve')}
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                  >
                    <FaCheckCircle className="mr-1" />
                    Mark Reviewed
                  </Button>
                  <Button
                    onClick={() => handleAction(report, 'dismiss')}
                    size="sm"
                    variant="outline"
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <FaTimes className="mr-1" />
                    Dismiss
                  </Button>
                  <Button
                    onClick={() => handleAction(report, 'delete-content')}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash className="mr-1" />
                    Delete Content
                  </Button>
                  {report.contentAuthorId && (
                    <Button
                      onClick={() => handleAction(report, 'block-author')}
                      size="sm"
                      variant="outline"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <FaBan className="mr-1" />
                      Block Author
                    </Button>
                  )}
                </div>
              )}

              {report.status !== 'pending' && (
                <div className="text-sm text-gray-600">
                  {report.reviewedBy && (
                    <p>
                      Reviewed by <span className="font-medium">{report.reviewedBy.username}</span>{' '}
                      on {report.reviewedAt && new Date(report.reviewedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>{getActionDescription()}</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="py-4">
              <p className="text-sm font-medium text-gray-700">Report Details:</p>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">Reporter:</span>{' '}
                  {selectedReport.reportedBy.username}
                </p>
                <p className="text-sm text-gray-900 mt-1">
                  <span className="font-semibold">Content Author:</span>{' '}
                  {selectedReport.contentAuthor}
                </p>
                <p className="text-sm text-gray-900 mt-1">
                  <span className="font-semibold">Reason:</span> {selectedReport.reason}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false)
                setSelectedReport(null)
                setError(null)
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant={
                actionType === 'delete-content' || actionType === 'block-author'
                  ? 'destructive'
                  : 'default'
              }
              onClick={handleConfirmAction}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
