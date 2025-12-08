'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaUsers, FaFlag, FaCog } from 'react-icons/fa'
import { IoArrowBack } from 'react-icons/io5'
import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoClose } from 'react-icons/io5'

interface AdminNavbarProps {
  username?: string
}

export default function AdminNavbar({ username }: AdminNavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaHome },
    { name: 'Users', href: '/admin/users', icon: FaUsers },
    { name: 'Reports', href: '/admin/reports', icon: FaFlag },
    { name: 'Settings', href: '/admin/settings', icon: FaCog },
  ]

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-3">
          <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <IoClose className="text-2xl" />
            ) : (
              <GiHamburgerMenu className="text-xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-900">{username || 'Admin'}</span>
                </span>
                <span className="px-2 py-0.5 bg-cyan-600 text-white rounded-full text-[10px] font-bold uppercase">
                  Admin
                </span>
              </div>
              <Link
                href="/home"
                className="flex items-center gap-1 text-gray-600 hover:text-cyan-600 transition-colors text-xs font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <IoArrowBack className="text-sm" />
                <span>Back</span>
              </Link>
            </div>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${
                      active
                        ? 'bg-cyan-50 text-cyan-600 border-l-4 border-cyan-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Desktop Header - Top row */}
        <div className="hidden md:flex items-center justify-between py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-gray-900">{username || 'Admin'}</span>
              </span>
              <span className="px-3 py-1 bg-cyan-600 text-white rounded-full text-xs font-bold uppercase">
                Admin
              </span>
            </div>

            <Link
              href="/home"
              className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors text-sm font-medium border-l border-gray-300 pl-6"
            >
              <IoArrowBack />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation tabs */}
        <div className="hidden md:flex gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-medium ${
                  active
                    ? 'border-cyan-600 text-cyan-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="text-lg" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
