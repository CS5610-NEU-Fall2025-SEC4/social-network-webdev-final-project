'use client'
import Link from 'next/link'
import { IoHomeOutline, IoCreateOutline } from 'react-icons/io5'
import { CiLogin, CiSearch } from 'react-icons/ci'
import { DiHackernews } from 'react-icons/di'

export default function Navigation({
  open,
  setOpen,
}: {
  open?: boolean
  setOpen?: (val: boolean) => void
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex fixed top-0 bottom-0 left-0 w-32 bg-blue-100 flex-col items-center py-6 space-y-6 shadow-md z-20"
        id="wd-hckrnws-navigation"
      >
        <SidebarLinks />
      </nav>

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-40 bg-blue-100 shadow-md transform transition-transform duration-300 z-30 md:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setOpen && setOpen(false)}
            className="text-lg font-semibold hover:text-blue-600"
          >
            ✕
          </button>
        </div>
        <SidebarLinks />
      </div>

      {/* Overlay for mobile sidebar, so that it closes when clicked*/}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 md:hidden z-20"
          onClick={() => setOpen && setOpen(false)}
        />
      )}
    </>
  )
}

function SidebarLinks() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <Link
        href="/"
        className="wd-nav-bar-item flex flex-col items-center text-black hover:text-blue-600"
      >
        <DiHackernews className="text-4xl mb-1" />
        <span className="font-semibold text-sm">HckrNws</span>
      </Link>

      <Link
        href="/home"
        className="wd-nav-bar-item flex flex-col items-center text-black hover:text-blue-600 no-underline"
      >
        <IoHomeOutline className="text-3xl mb-1" />
        <span className="text-sm ">Home</span>
      </Link>

      <Link
        href="/search"
        className="wd-nav-bar-item flex flex-col items-center text-black hover:text-blue-600 no-underline"
      >
        <CiSearch className="text-3xl mb-1" />
        <span className="text-sm">Search</span>
      </Link>

      <Link
        href="/logIn"
        className="wd-nav-bar-item flex flex-col items-center text-black hover:text-blue-600 no-underline"
      >
        <CiLogin className="text-3xl mb-1" />
        <span className="text-sm">Log In</span>
      </Link>

      <Link
        href="/register"
        className="wd-nav-bar-item flex flex-col items-center text-black hover:text-blue-600 no-underline"
      >
        <IoCreateOutline className="text-3xl mb-1" />
        <span className="text-sm">Register</span>
      </Link>
    </div>
  )
}
