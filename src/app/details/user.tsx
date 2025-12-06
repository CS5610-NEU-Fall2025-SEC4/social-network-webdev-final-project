'use client'
import { useMemo, useState } from 'react'

export default function UserDetails({
  username,
  id,
  firstName,
  lastName,
  email,
}: {
  username: string
  id: string
  firstName: string
  lastName: string
  email: string
}) {
  const displayName = useMemo(() => {
    if (!firstName && !lastName) return username
    if (firstName && lastName) {
      const f = firstName.trim()
      const l = lastName.trim()
      if (!l) return f
      if (f.toLowerCase() === l.toLowerCase()) return f
      if (f.toLowerCase().includes(l.toLowerCase())) return f
      return `${f} ${l}`
    }
    return firstName || lastName || username
  }, [firstName, lastName, username])

  const idShort = useMemo(() => (id?.length > 12 ? `${id.slice(0, 8)}…` : id), [id])
  const [copied, setCopied] = useState(false)
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (err) {
      console.error('Copy user ID failed:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-cyan-600/10 border border-cyan-300/40 flex items-center justify-center text-xl font-semibold text-cyan-700">
          {displayName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-xl font-semibold leading-tight text-gray-900">{displayName}</h3>
          <p className="text-sm text-gray-600">@{username}</p>
        </div>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col">
          <dt className="text-gray-500">First Name</dt>
          <dd className="font-medium text-gray-800">
            {firstName || <span className="text-gray-400">—</span>}
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-gray-500">Last Name</dt>
          <dd className="font-medium text-gray-800">
            {lastName || <span className="text-gray-400">—</span>}
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-gray-500">Email</dt>
          <dd>
            <a href={`mailto:${email}`} className="text-cyan-700 hover:underline break-all">
              {email}
            </a>
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-gray-500 flex items-center gap-1">User ID</dt>
          <dd className="flex items-center gap-2">
            <code className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">{idShort}</code>
            <button
              type="button"
              onClick={copyId}
              className="text-xs px-2 py-1 rounded border border-cyan-300 text-cyan-700 hover:bg-cyan-50 transition"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
      </dl>
    </div>
  )
}
