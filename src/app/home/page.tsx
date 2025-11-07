import TopStories from '../top/page'

export default function Home() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mt-1 mb-3 text-gray-800 ps-3">
        Explore trending posts and the most discussed topics from the Community.
      </h2>

      <div id="top-news" className="mt-4">
        <TopStories />
      </div>
    </div>
  )
}
