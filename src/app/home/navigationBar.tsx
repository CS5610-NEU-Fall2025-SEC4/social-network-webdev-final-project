'use client'
import Link from 'next/link'
import { IoHomeOutline } from 'react-icons/io5'
import { CiLogin, CiSearch, CiLogout } from 'react-icons/ci'
import { FaRegCircleUser } from 'react-icons/fa6'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { MdAdminPanelSettings } from "react-icons/md";

function RoleBadge({ role }: { role: string }) {
  const colors = {
    USER: 'bg-blue-500 text-white',
    EMPLOYER: 'bg-green-500 text-white',
    ADMIN: 'bg-red-500 text-white',
  }

  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[role as keyof typeof colors] || colors.USER}`}
    >
      {role}
    </span>
  )
}

export default function Navigation({
  open,
  setOpen,
}: {
  open?: boolean
  setOpen?: (val: boolean) => void
}) {
  const { authenticated, profile, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <nav
        className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-white via-white/90 to-black backdrop-blur items-center justify-between px-8 shadow-md z-20 border-b border-white/10"
        id="wd-hckrnws-navigation"
      >
        <Link href="/home" className="flex items-center !no-underline group">
          <Image
            src="/images/HckrNws.png"
            alt="HckrNws logo"
            width={48}
            height={48}
            priority
            className="rounded-md shadow-sm group-hover:scale-105 transition-transform border-none outline-none ring-0"
          />
        </Link>

        <div className="flex items-center space-x-8">
          {mounted && (
            <NavLinks
              isAuthenticated={authenticated}
              handleLogout={handleLogout}
              userRole={profile?.role || null}
              username={profile?.username || ''}
            />
          )}
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-white to-black backdrop-blur-md shadow-lg border-r border-white/10 transform transition-transform duration-300 z-30 md:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/home" className="flex items-center !no-underline">
            <Image
              src="/images/HckrNws.png"
              alt="HckrNws logo"
              width={40}
              height={40}
              className="rounded-md shadow-sm border-none outline-none ring-0"
            />
          </Link>
          <button
            onClick={() => setOpen && setOpen(false)}
            className="text-2xl font-semibold text-white hover:text-cyan-400"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          {mounted && (
            <MobileNavLinks
              isAuthenticated={authenticated}
              handleLogout={handleLogout}
              userRole={profile?.role || null}
              username={profile?.username || ''}
            />
          )}
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
  userRole,
  username,
}: {
  isAuthenticated: boolean
  handleLogout: () => void
  userRole: string | null
  username: string
}) {
  return (
    <>
      {isAuthenticated && (
        <>
          <Link
            href="/profile"
            className="flex items-center space-x-1 text-white hover:text-cyan-400 !no-underline"
          >
            <FaRegCircleUser className="text-2xl" />
            <div className="flex flex-col items-start -space-y-0.5">
              <span className="text-sm font-medium">{username || 'Profile'}</span>
              {userRole && <RoleBadge role={userRole} />}
            </div>
          </Link>
          {userRole === 'ADMIN' && (
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-1 text-yellow-300 hover:text-yellow-400 !no-underline font-semibold"
            >
              <MdAdminPanelSettings className="text-xl" />
              <span className="text-sm">Admin</span>
            </Link>
          )}
        </>
      )}

      <Link
        href="/home"
        className="flex items-center space-x-1 text-white hover:text-cyan-400 !no-underline"
      >
        <IoHomeOutline className="text-2xl" />
        <span className="text-sm font-medium">Home</span>
      </Link>

      <Link
        href="/search"
        className="flex items-center space-x-1 text-white hover:text-cyan-400 !no-underline"
      >
        <CiSearch className="text-2xl" />
        <span className="text-sm font-medium">Search</span>
      </Link>

      {!isAuthenticated && (
        <Link
          href="/logIn"
          className="flex items-center space-x-1 text-white hover:text-cyan-400 !no-underline"
        >
          <CiLogin className="text-2xl" />
          <span className="text-sm font-medium">Log In</span>
        </Link>
      )}

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-white hover:text-red-500"
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
  userRole,
  username,
}: {
  isAuthenticated: boolean
  handleLogout: () => void
  userRole: string | null
  username: string
}) {
  return (
    <>
      {isAuthenticated && (
        <>
          <Link
            href="/profile"
            className="flex items-center space-x-3 text-white hover:text-cyan-400 !no-underline py-2"
          >
            <FaRegCircleUser className="text-2xl" />
            <div className="flex flex-col items-start -space-y-0.5">
              <span className="text-base">{username || 'Profile'}</span>
              {userRole && <RoleBadge role={userRole} />}
            </div>
          </Link>

          {userRole === 'ADMIN' && (
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 text-yellow-300 hover:text-yellow-400 !no-underline py-2 font-semibold"
            >
              <MdAdminPanelSettings className="text-2xl" />
              <span className="text-base">Admin Dashboard</span>
            </Link>
          )}
        </>
      )}
      <Link
        href="/home"
        className="flex items-center space-x-3 text-white hover:text-cyan-400 !no-underline py-2"
      >
        <IoHomeOutline className="text-2xl" />
        <span className="text-base">Home</span>
      </Link>

      <Link
        href="/search"
        className="flex items-center space-x-3 text-white hover:text-cyan-400 !no-underline py-2"
      >
        <CiSearch className="text-2xl" />
        <span className="text-base">Search</span>
      </Link>

      {!isAuthenticated && (
        <Link
          href="/logIn"
          className="flex items-center space-x-3 text-white hover:text-cyan-400 !no-underline py-2"
        >
          <CiLogin className="text-2xl" />
          <span className="text-base">Log In</span>
        </Link>
      )}

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-white hover:text-red-500 py-2 w-full text-left"
        >
          <CiLogout className="text-2xl" />
          <span className="text-base">Logout</span>
        </button>
      )}
    </>
  )
}
