'use client'

import { useAuth } from '@/app/context/AuthContext'
import CustomContent from './CustomContent'
import { CreatePostButton } from '@/app/components/createPostButton'

interface HomeClientProps {
  topStories: React.ReactNode
}

export default function HomeClient({ topStories }: HomeClientProps) {
  const { authenticated } = useAuth()

  return (
    <div className="p-4 md:p-6">
      {authenticated && (
        <>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold mt-1 mb-3 text-gray-800 ps-3">
              Welcome Back! Here are your recent posts.
            </h2>
            <CreatePostButton />
          </div>
          <div className="mt-4">
            <CustomContent />
          </div>
        </>
      )}

      {!authenticated && (
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 ps-3">
            Explore trending posts and the most discussed topics from the Community.
          </h2>
          <CreatePostButton />
        </div>
      )}

      {authenticated && (
        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-800 ps-3">
          Explore trending posts and the most discussed topics from the Community.
        </h2>
      )}

      <div id="top-news" className="mt-4">
        {topStories}
      </div>
    </div>
  )
}
