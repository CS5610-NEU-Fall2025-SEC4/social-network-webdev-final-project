'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { updateStory, getStoryById, UpdateStoryPayload } from '@/app/services/postAPI'
import { useAuth } from '@/app/context/AuthContext'
import { HNStory } from '@/app/types/types'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const storyId = params.storyId as string
  const { token, profile } = useAuth()

  const [story, setStory] = useState<HNStory | null>(null)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true)
        const fetchedStory = await getStoryById(storyId)
        setStory(fetchedStory)

        setTitle(fetchedStory.title || '')
        setText(fetchedStory.text || '')
        setUrl(fetchedStory.url || '')

        if (!token || !profile) {
          setError('You must be logged in to edit posts.')
          return
        }

        const isOwner = fetchedStory.author === profile.username
        const isAdmin = profile.role === 'ADMIN'

        if (!isOwner && !isAdmin) {
          setError('You do not have permission to edit this post.')
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to load post.')
        } else {
          setError('An unknown error occurred.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (storyId) {
      fetchStory()
    }
  }, [storyId, token, profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (!token) {
      setError('You must be logged in to edit a post.')
      setSubmitting(false)
      return
    }

    if (!title.trim()) {
      setError('Title is required.')
      setSubmitting(false)
      return
    }

    if (story?.type === 'story' && !url && !text) {
      setError('Story must have either a URL or text content.')
      setSubmitting(false)
      return
    }

    if ((story?.type === 'askHN' || story?.type === 'showHN') && !text) {
      setError('Ask HN/Show HN must have text content.')
      setSubmitting(false)
      return
    }

    if (story?.type === 'job' && !url) {
      setError('Job post must have a URL.')
      setSubmitting(false)
      return
    }

    const payload: UpdateStoryPayload = {
      title: title.trim(),
    }

    if (text.trim() !== (story?.text || '')) {
      payload.text = text.trim() || undefined
    }

    if (url.trim() !== (story?.url || '')) {
      payload.url = url.trim() || undefined
    }

    try {
      await updateStory(storyId, payload, token)
      router.push(`/details/${storyId}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to update post.')
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-600">Loading post...</div>
        </div>
      </div>
    )
  }

  if (error && !story) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => router.back()} className="mt-4" variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-sm text-gray-600 mt-2">
          Type: <span className="font-semibold">{story?.type}</span>
          {story?._tags && story._tags.length > 0 && <> • Tags: {story._tags.join(', ')}</>}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            disabled={submitting}
          />
        </div>

        {(story?.type === 'story' || story?.type === 'job') && (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
              {story?.type === 'job' && <span className="text-red-500"> *</span>}
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                story?.type === 'job' ? 'Required for job posts' : 'Optional for stories'
              }
              disabled={submitting}
            />
          </div>
        )}

        {(story?.type === 'askHN' || story?.type === 'showHN' || story?.type === 'story') && (
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
              {(story?.type === 'askHN' || story?.type === 'showHN') && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                story?.type === 'askHN' || story?.type === 'showHN'
                  ? 'Required for Ask HN/Show HN'
                  : 'Optional text content'
              }
              rows={8}
              disabled={submitting}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Post'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
