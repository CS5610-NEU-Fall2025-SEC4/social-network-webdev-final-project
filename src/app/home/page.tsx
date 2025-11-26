import TopStories from '../top/page'
import { CreatePostButton } from '@/components/ui/createPostButton'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold mt-1 mb-3 text-gray-800 ps-3">
          Explore trending posts and the most discussed topics from the Community.
        </h2>
        <CreatePostButton />
      </div>
      <div id="top-news" className="mt-4">
        <TopStories />
      </div>
    </div>
  )
}
