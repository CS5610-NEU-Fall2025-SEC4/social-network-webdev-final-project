'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 border-t border-gray-300">
      <div className="max-w-4xl mx-auto">
        <Link href="/aboutUs" className="!text-gray-700 mx-3 !no-underline">
          About Us
        </Link>

        <span className="text-gray-400">|</span>

        <button onClick={() => alert('To be implemented!')} className="text-gray-700 mx-3">
          Contact Us
        </button>

        <p className="text-gray-500 text-sm mt-2 mb-0">
          &copy; {new Date().getFullYear()} HckrNws Project
        </p>
      </div>
    </footer>
  )
}
