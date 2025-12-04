'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaUsers, FaFlag, FaCog } from 'react-icons/fa'

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: FaHome,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: FaUsers,
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: FaFlag,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: FaCog,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-orange-500">Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-3">Hckrnws</p>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-gray-700">
        <Link
          href="/home"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>← Back to Site</span>
        </Link>
      </div>
    </aside>
  )
}
