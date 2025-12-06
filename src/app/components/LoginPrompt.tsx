'use client'

import Link from 'next/link'

export default function LoginPrompt({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm p-4">
        <h3 className="text-lg font-semibold mb-2">Please log in</h3>
        <p className="text-sm text-gray-600 mb-4">
          You need to be logged in to perform this action.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <Link
            href="/logIn"
            className="px-3 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700"
            onClick={onClose}
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
