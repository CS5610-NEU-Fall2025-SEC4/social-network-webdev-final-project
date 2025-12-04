'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { FaFlag } from 'react-icons/fa'
import { reportStory } from '@/app/services/reportAPI'

interface ReportButtonProps {
  storyId: string
  contentType: 'story' | 'comment'
}

export default function ReportButton({ storyId, contentType }: ReportButtonProps) {
  const { authenticated, token, profile } = useAuth()
  const [showDialog, setShowDialog] = useState(false)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!authenticated || !profile) {
    return null
  }

  if (profile.role === 'ADMIN') {
    return null
  }

  const handleSubmit = async () => {
    if (!token) {
      setError('You must be logged in to report content.')
      return
    }

    if (!reason.trim()) {
      setError('Please provide a reason for reporting.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await reportStory(storyId, reason.trim(), contentType, token)
      setSuccess(true)
      setReason('')
      setTimeout(() => {
        setShowDialog(false)
        setSuccess(false)
      }, 2000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to submit report.')
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-gray-600 hover:text-red-600"
      >
        <FaFlag />
        Report
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report {contentType === 'story' ? 'Post' : 'Comment'}</DialogTitle>
            <DialogDescription>
              Help us maintain a safe community. Please describe why you&apos;re reporting this
              content.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-6 text-center">
              <div className="text-green-600 text-4xl mb-3">✓</div>
              <p className="text-green-700 font-medium">Report submitted successfully</p>
              <p className="text-sm text-gray-600 mt-2">Our moderators will review this content.</p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for reporting
                </label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe why this content is inappropriate..."
                  rows={4}
                  disabled={submitting}
                />
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
                    setShowDialog(false)
                    setReason('')
                    setError(null)
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleSubmit}
                  disabled={submitting || !reason.trim()}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
