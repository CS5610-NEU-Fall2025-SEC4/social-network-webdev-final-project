'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { uploadProfilePhoto } from '@/app/services/userAPI'
import Image from 'next/image'

type Props = {
  currentUrl?: string
  onClose: () => void
  onChange: (url: string) => void
}

export default function ProfilePhotoModal({ currentUrl, onClose, onChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentUrl)
  const [viewMode, setViewMode] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [fileInputId] = useState<string>(() => `file-input-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    setPreviewUrl(currentUrl)
  }, [currentUrl])

  const { token } = useAuth()
  const handleFile = async (file?: File) => {
    if (!file) return
    setPreviewUrl('')
    try {
      setUploading(true)
      const res = await uploadProfilePhoto(token || '', file)
      setPreviewUrl(res.avatarUrl)
      onChange(res.avatarUrl)
    } catch (err) {
      console.error('Profile photo upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Profile Picture</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {!viewMode && (
          <div className="flex items-center gap-2">
            <button
              className="flex-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              onClick={() => setViewMode(true)}
            >
              View picture
            </button>
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="hidden"
            />
            <button
              className="flex-1 px-3 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 text-sm disabled:opacity-60"
              onClick={() => document.getElementById(fileInputId)?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload new picture'}
            </button>
          </div>
        )}
        {viewMode && (
          <div className="space-y-3">
            {previewUrl ? (
              <div className="w-full flex items-center justify-center">
                <Image
                  src={previewUrl}
                  alt="Profile"
                  width={192}
                  height={192}
                  className="w-48 h-48 object-cover rounded"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600">No profile picture set.</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                onClick={() => setViewMode(false)}
              >
                Back
              </button>
              <button
                className="px-3 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 text-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
