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
      <div className="flex items-center justify-between p-4 bg-gray-900 md:hidden">
        <button onClick={() => setOpen(!open)} className="text-2xl text-white hover:text-cyan-400">
          <GiHamburgerMenu />
        </button>
        <h1 className="font-semibold text-lg text-white">HckrNws</h1>
      </div>

      <Navigation open={open} setOpen={setOpen} />

      <main className="flex-1 md:mt-16 overflow-y-auto">{children}</main>

      <Footer />
    </div>
  )
}
