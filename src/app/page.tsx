'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-black text-white">
      <nav className="sticky top-0 z-30 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/home" className="font-semibold text-lg !no-underline text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
              HckrNws
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/home">
              <button className="px-4 py-2 rounded-md text-sm text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition">
                Explore Stories
              </button>
            </Link>
            <Link href="/logIn">
              <button className="px-4 py-2 rounded-md text-sm text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition">
                Join Conversation
              </button>
            </Link>
          </div>
        </div>
      </nav>
      <div className="wd-hero-img">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white pb-4">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
            HckrNws
          </span>
        </h1>

        <h3 className="text-lg text-gray-300 max-w-2xl mb-8">
          The front page of technology. Discover, discuss, and share what&apos;s next in tech,
          startups, and science.
        </h3>
      </div>
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex flex-wrap justify-center gap-4 mb-16" />

        <div className="max-w-4xl text-left mb-16">
          <h3 className="text-3xl font-semibold text-center mb-8">Why You&apos;ll Love HckrNws</h3>

          <div className="space-y-6">
            <div>
              <p className="font-semibold text-white/90">Feature 1:</p>
              <p className="text-white/80">
                Stay Ahead of the Curve — Get access to the most important articles, research, and
                breakthroughs in technology, hand-picked and vetted by a community of passionate
                experts.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white/90">Feature 2:</p>
              <p className="text-white/80">
                A Vibrant Community — Engage in intelligent, in-depth discussions with developers,
                founders, and tech enthusiasts who share your passion.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white/90">Feature 3:</p>
              <p className="text-white/80">
                Uncover Hidden Gems — Discover niche projects, indie developer tools, and
                groundbreaking ideas you won&apos;t see in mainstream tech news.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-xl text-center">
          <h3 className="text-2xl font-semibold mb-4">Want to get to know us better?</h3>
          <Link href="./aboutUs">
            <button className="px-6 py-2 !rounded-lg border border-white/30 text-white hover:border-white/60 hover:bg-white/10 transition">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
