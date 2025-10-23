'use client'
import { ReactNode, useState } from 'react'
import Navigation from '../home/navigationBar'
import { GiHamburgerMenu } from 'react-icons/gi'

export default function HckrNwsLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [open, setOpen] = useState(false)

  return (
    <div id="wd-hckrnws" className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between p-4 bg-blue-100 md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl text-gray-800 hover:text-blue-600"
        >
          <GiHamburgerMenu />
        </button>
        <h1 className="font-semibold text-lg">HckrNws</h1>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Navigation open={open} setOpen={setOpen} />

        {/* Main content */}
        <main className="flex-1 p-4 pt-6 pl-4 md:p-6 md:ml-32 ">{children}</main>
      </div>
    </div>
  )
}
