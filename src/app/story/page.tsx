'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createStory, CreateStoryPayload } from '@/app/services/postAPI'
import { useAuth } from '@/app/context/AuthContext'

export default function CreatePostPage() {
  const router = useRouter()
  const { token } = useAuth()

  const [title, setTitle] = useState('')
  const [type, setType] = useState<CreateStoryPayload['type']>('story')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!token) {
      setError('You must be logged in to create a post.')
      setLoading(false)
      return
    }

    let finalTitle = title
    if (type === 'askHN') {
      finalTitle = `Ask HN: ${title}`
    } else if (type === 'showHN') {
      finalTitle = `Show HN: ${title}`
    }

    const payload: CreateStoryPayload = {
      title: finalTitle,
      type,
    }

    if (type === 'story' || type === 'job') {
      if (url) payload.url = url
      if (text) payload.text = text
    } else if (type === 'askHN' || type === 'showHN') {
      if (text) payload.text = text
      if (url) payload.url = url
    }
    if (!title) {
      setError('Title is required.')
      setLoading(false)
      return
    }
    if (type === 'story' && !url && !text) {
      setError('Story must have either a URL or text content.')
      setLoading(false)
      return
    }
    if ((type === 'askHN' || type === 'showHN') && !text) {
      setError('Ask HN/Show HN must have text content.')
      setLoading(false)
      return
    }
    if (type === 'job' && !url) {
      setError('Job post must have a URL.')
      setLoading(false)
      return
    }

    try {
      const newStory = await createStory(payload, token)
      router.push(`/details/post/${newStory.id}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to create post.')
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
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
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <Select
            value={type}
            onValueChange={(value: CreateStoryPayload['type']) => setType(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select post type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="askHN">Ask HN</SelectItem>
              <SelectItem value="showHN">Show HN</SelectItem>
              <SelectItem value="job">Job</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(type === 'story' || type === 'job') && (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (optional for story, required for job)"
              disabled={loading}
            />
          </div>
        )}

        {(type === 'askHN' || type === 'showHN' || type === 'story') && (
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text content (required for Ask HN/Show HN)"
              rows={5}
              disabled={loading}
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </div>
  )
}
