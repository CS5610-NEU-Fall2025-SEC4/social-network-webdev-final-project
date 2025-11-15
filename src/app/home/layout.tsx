'use client'
import { ReactNode, useState } from 'react'
import Navigation from './navigationBar'
import Footer from './footer'
import { GiHamburgerMenu } from 'react-icons/gi'

export default function HckrNwsLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [open, setOpen] = useState(false)

  return (
    <div id="wd-hckrnws" className="flex flex-col min-h-screen">
      {/* Mobile header with hamburger */}
      <div className="flex items-center justify-between p-4 bg-blue-100 md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl text-gray-800 hover:text-blue-600"
        >
          <GiHamburgerMenu />
        </button>
        <h1 className="font-semibold text-lg">HckrNws</h1>
      </div>

      {/* Navigation - now at top on desktop */}
      <Navigation open={open} setOpen={setOpen} />

      {/* Main content - adjusted padding for top nav */}
      <main className="flex-1 p-4 md:mt-16 md:p-6 overflow-y-auto">{children}</main>
      <Footer />
    </div>
  )
}
