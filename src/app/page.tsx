'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const nav = document.getElementById('landing-navbar')
    const onScroll = () => {
      if (!nav) return
      if (window.scrollY > 40) nav.classList.add('scrolled')
      else nav.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScroll)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.15 },
    )
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="global-fixed-bg text-white min-h-screen">
      {/* Navbar */}
      <nav
        id="landing-navbar"
        className="navbar-glass sticky top-0 z-40 w-full transition-all px-4 py-3"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/home" className="flex items-center !no-underline">
            <Image
              src="/images/HckrNws.png"
              alt="HckrNws logo"
              width={48}
              height={48}
              priority
              className="rounded-md shadow-sm hover:scale-105 transition-transform border-none outline-none ring-0"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/home" className="!no-underline">
              <button className="btn-cyan-outline text-sm">Explore Stories</button>
            </Link>
            <Link href="/logIn" className="!no-underline">
              <button className="btn-cyan text-sm">Join Conversation</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with pinned center content */}
      <section className="wd-hero-img hero-pin-wrapper">
        <div className="hero-pin">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 fade-in">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-600 animate-gradient-x">
              HckrNws
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 fade-in">
            The front page of technology. Discover, discuss, and share what&apos;s next in tech,
            startups, and science.
          </p>
          <div className="flex flex-wrap gap-4 justify-center fade-in">
            <Link href="/search" className="!no-underline">
              <button className="btn-cyan text-sm">Start Exploring</button>
            </Link>
            <Link href="/register" className="!no-underline">
              <button className="btn-cyan-outline text-sm">Create Account</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className="px-6 py-20 flex flex-col items-center text-center bg-transparent">
        <div className="max-w-4xl text-left mb-20 fade-in">
          <h3 className="text-3xl font-semibold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-cyan-600">
            Why You&apos;ll Love HckrNws
          </h3>
          <div className="space-y-10">
            <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group fade-in">
              <p className="font-semibold text-white/95 mb-2">Stay Ahead of the Curve</p>
              <p className="text-white/80">
                Access the most important articles, research, and breakthroughs in technology,
                hand-picked and vetted by a community of passionate experts.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group fade-in">
              <p className="font-semibold text-white/95 mb-2">A Vibrant Community</p>
              <p className="text-white/80">
                Engage in intelligent, in-depth discussions with developers, founders, and tech
                enthusiasts who share your passion.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group fade-in">
              <p className="font-semibold text-white/95 mb-2">Uncover Hidden Gems</p>
              <p className="text-white/80">
                Discover niche projects, indie developer tools, and groundbreaking ideas you
                won&apos;t see in mainstream tech news.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-xl text-center fade-in">
          <h3 className="text-2xl font-semibold mb-5">Want to get to know us better?</h3>
          <Link href="./aboutUs" className="!no-underline">
            <button className="px-8 py-3 rounded-full border border-white/30 text-white bg-white/5 hover:border-white/60 hover:bg-white/15 transition shadow-md hover:shadow-lg">
              Learn More
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
