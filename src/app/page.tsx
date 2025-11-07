'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-black text-white">
      <div className="wd-hero-img">
        <h1 className="text-7xl font-boldmb-2 text-white pb-5">
          Welcome to <span className="wd-cyan">HckrNws</span>
        </h1>

        <h3 className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mb-8">
          The front page of technology. Discover, discuss, and share what&apos;s next in tech,
          startups, and science.
        </h3>
      </div>
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link href="./home">
            <button className="bg-blue-600 text-white px-6 py-2 !rounded-xl hover:bg-blue-700 transition">
              Explore Stories
            </button>
          </Link>
          <Link href="./logIn">
            <button className="bg-green-600 text-white px-6 py-2 !rounded-xl hover:bg-green-700 transition">
              Join the Conversation
            </button>
          </Link>
        </div>

        <div className="max-w-3xl text-left mb-16">
          <h3 className="text-2xl font-semibold text-center mb-6">Why You&apos;ll Love HckrNws</h3>

          <div className="space-y-6">
            <div>
              <p className="font-bold">Feature 1:</p>
              <p>
                Stay Ahead of the Curve — Get access to the most important articles, research, and
                breakthroughs in technology, hand-picked and vetted by a community of passionate
                experts.
              </p>
            </div>
            <div>
              <p className="font-bold">Feature 2:</p>
              <p>
                A Vibrant Community — Engage in intelligent, in-depth discussions with developers,
                founders, and tech enthusiasts who share your passion.
              </p>
            </div>
            <div>
              <p className="font-bold">Feature 3:</p>
              <p>
                Uncover Hidden Gems — Discover niche projects, indie developer tools, and
                groundbreaking ideas you won&apos;t see in mainstream tech news.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-xl text-center">
          <h3 className="text-2xl font-semibold mb-2">Want to get to know us better?</h3>
          <Link href="./aboutUs">
            <button className="bg-gray-800 text-white px-6 py-2 !rounded-lg hover:bg-gray-900 transition">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
