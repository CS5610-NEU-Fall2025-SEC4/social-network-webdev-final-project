'use client'
import Link from 'next/link'
import { IoHomeOutline } from 'react-icons/io5'
import { CiLogin, CiSearch, CiLogout } from 'react-icons/ci'
import { FaRegCircleUser } from 'react-icons/fa6'
import { DiHackernews } from 'react-icons/di'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navigation({
  open,
  setOpen,
}: {
  open?: boolean
  setOpen?: (val: boolean) => void
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token')
    }
    return false
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')

      if (!token) {
        setIsAuthenticated(false)
        return
      }

      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const res = await fetch(`${base}/users/isAuthenticated`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          localStorage.removeItem('access_token')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    router.push('/logIn')
  }

  return (
    <>
      {}
      <nav
        className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-blue-100 items-center justify-between px-8 shadow-md z-20"
        id="wd-hckrnws-navigation"
      >
        <Link
          href="/home"
          className="flex items-center space-x-2 text-black hover:text-blue-600 !no-underline"
        >
          <DiHackernews className="text-4xl" />
          <span className="font-bold text-xl">HckrNws</span>
        </Link>

        <div className="flex items-center space-x-8">
          <NavLinks isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        </div>
      </nav>

      {}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-100 shadow-md transform transition-transform duration-300 z-30 md:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/home" className="flex items-center space-x-2 !no-underline">
            <DiHackernews className="text-3xl" />
            <span className="font-bold text-lg">HckrNws</span>
          </Link>
          <button
            onClick={() => setOpen && setOpen(false)}
            className="text-2xl font-semibold hover:text-blue-600"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <MobileNavLinks isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 md:hidden z-20"
          onClick={() => setOpen && setOpen(false)}
        />
      )}
    </>
  )
}

function NavLinks({
  isAuthenticated,
  handleLogout,
}: {
  isAuthenticated: boolean
  handleLogout: () => void
}) {
  return (
    <>
      {isAuthenticated && (
        <Link
          href="/profile"
          className="flex items-center space-x-1 text-black hover:text-blue-600 !no-underline"
        >
          <FaRegCircleUser className="text-2xl" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
      )}

      <Link
        href="/home"
        className="flex items-center space-x-1 text-black hover:text-blue-600 !no-underline"
      >
        <IoHomeOutline className="text-2xl" />
        <span className="text-sm font-medium">Home</span>
      </Link>

      <Link
        href="/search"
        className="flex items-center space-x-1 text-black hover:text-blue-600 !no-underline"
      >
        <CiSearch className="text-2xl" />
        <span className="text-sm font-medium">Search</span>
      </Link>

      {!isAuthenticated && (
        <Link
          href="/logIn"
          className="flex items-center space-x-1 text-black hover:text-blue-600 !no-underline"
        >
          <CiLogin className="text-2xl" />
          <span className="text-sm font-medium">Log In</span>
        </Link>
      )}

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-black hover:text-red-600"
        >
          <CiLogout className="text-2xl" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      )}
    </>
  )
}

function MobileNavLinks({
  isAuthenticated,
  handleLogout,
}: {
  isAuthenticated: boolean
  handleLogout: () => void
}) {
  return (
    <>
      {isAuthenticated && (
        <Link
          href="/profile"
          className="flex items-center space-x-3 text-black hover:text-blue-600 !no-underline py-2"
        >
          <FaRegCircleUser className="text-2xl" />
          <span className="text-base">Profile</span>
        </Link>
      )}
      <Link
        href="/home"
        className="flex items-center space-x-3 text-black hover:text-blue-600 !no-underline py-2"
      >
        <IoHomeOutline className="text-2xl" />
        <span className="text-base">Home</span>
      </Link>

      <Link
        href="/search"
        className="flex items-center space-x-3 text-black hover:text-blue-600 !no-underline py-2"
      >
        <CiSearch className="text-2xl" />
        <span className="text-base">Search</span>
      </Link>

      {!isAuthenticated && (
        <Link
          href="/logIn"
          className="flex items-center space-x-3 text-black hover:text-blue-600 !no-underline py-2"
        >
          <CiLogin className="text-2xl" />
          <span className="text-base">Log In</span>
        </Link>
      )}

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-black hover:text-red-600 py-2 w-full text-left"
        >
          <CiLogout className="text-2xl" />
          <span className="text-base">Logout</span>
        </button>
      )}
    </>
  )
}
