'use client'

import { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navigation from './home/navigationBar'
import Footer from './home/footer'
import { GiHamburgerMenu } from 'react-icons/gi'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const noNavPages = ['/logIn', '/register', '/']
  const shouldShowNav = !noNavPages.includes(pathname)

  if (!shouldShowNav) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between p-4 bg-blue-100 md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl text-gray-800 hover:text-blue-600"
        >
          <GiHamburgerMenu />
        </button>
        <h1 className="font-semibold text-lg">HckrNws</h1>
      </div>

      <Navigation open={open} setOpen={setOpen} />

      <main className="flex-1 md:mt-16 overflow-y-auto">{children}</main>

      <Footer />
    </div>
  )
}
