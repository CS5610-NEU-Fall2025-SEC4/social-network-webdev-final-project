'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { getBlockedEmails, blockEmail, unblockEmail } from '@/app/services/adminAPI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FaBan, FaCheckCircle, FaPlus } from 'react-icons/fa'

interface BlockedEmail {
  id: string
  email: string
  reason: string
  blockedBy: string
  createdAt: string
}

interface BlockedEmailsResponse {
  blockedEmails: BlockedEmail[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function SettingsPage() {
  const { token } = useAuth()
  const [blockedEmails, setBlockedEmails] = useState<BlockedEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newReason, setNewReason] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  const [selectedEmail, setSelectedEmail] = useState<BlockedEmail | null>(null)
  const [showUnblockDialog, setShowUnblockDialog] = useState(false)
  const [unblockLoading, setUnblockLoading] = useState(false)

  const fetchBlockedEmails = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      const response = (await getBlockedEmails(token, 1, 100)) as BlockedEmailsResponse
      setBlockedEmails(response.blockedEmails)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load blocked emails')
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlockedEmails()
  }, [token])

  const handleAddEmail = async () => {
    if (!token || !newEmail.trim()) return

    setAddLoading(true)
    setError(null)

    try {
      await blockEmail(newEmail.trim(), newReason.trim() || 'No reason provided', token)
      setShowAddDialog(false)
      setNewEmail('')
      setNewReason('')
      await fetchBlockedEmails()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setAddLoading(false)
    }
  }

  const handleUnblock = async () => {
    if (!token || !selectedEmail) return

    setUnblockLoading(true)
    setError(null)

    try {
      await unblockEmail(selectedEmail.email, token)
      setShowUnblockDialog(false)
      setSelectedEmail(null)
      await fetchBlockedEmails()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setUnblockLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage email blocking and system settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Blocked Emails</h2>
            <p className="text-sm text-gray-600 mt-1">
              Users with these email addresses cannot register
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <FaPlus />
            Block Email
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blocked emails...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && blockedEmails.length === 0 && (
          <div className="text-center py-12">
            <FaBan className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No blocked emails</p>
          </div>
        )}

        {!loading && !error && blockedEmails.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Blocked By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blockedEmails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{email.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{email.reason}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{email.blockedBy}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(email.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        onClick={() => {
                          setSelectedEmail(email)
                          setShowUnblockDialog(true)
                        }}
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                      >
                        <FaCheckCircle className="mr-1" />
                        Unblock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Email Address</DialogTitle>
            <DialogDescription>
              Users with this email address will not be able to register
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <Textarea
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Reason for blocking this email..."
                rows={3}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setNewEmail('')
                setNewReason('')
                setError(null)
              }}
              disabled={addLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddEmail} disabled={addLoading || !newEmail.trim()}>
              {addLoading ? 'Blocking...' : 'Block Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unblock Email</DialogTitle>
            <DialogDescription>
              Are you sure you want to unblock this email address?
            </DialogDescription>
          </DialogHeader>

          {selectedEmail && (
            <div className="py-4">
              <p className="text-sm font-medium text-gray-700">Email:</p>
              <p className="text-sm text-gray-900 mt-1">{selectedEmail.email}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUnblockDialog(false)
                setSelectedEmail(null)
              }}
              disabled={unblockLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUnblock} disabled={unblockLoading}>
              {unblockLoading ? 'Unblocking...' : 'Unblock Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
