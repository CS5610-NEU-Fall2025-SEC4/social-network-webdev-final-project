'use client'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold text-lg mb-2 text-white">Navigate</h3>
          <Link href="/logIn" className="hover:text-cyan-300 transition-colors">
            Log In
          </Link>
          <Link href="/register" className="hover:text-cyan-300 transition-colors">
            Register
          </Link>
          <Link href="/search" className="hover:text-cyan-300 transition-colors">
            Search
          </Link>
          <Link href="/aboutUs" className="hover:text-cyan-300 transition-colors">
            About Us
          </Link>
          <a href="mailto:contact@hckrnws.com" className="hover:text-cyan-300 transition-colors">
            Contact Us
          </a>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">HckrNws</h2>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} HckrNws Project. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:items-end">
          <h3 className="font-bold text-lg mb-2 text-white">Connect</h3>
          <div className="flex space-x-4 mb-2">
            <a
              href="https://github.com/theinhumaneme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
              title="Kalyan"
            >
              Kalyan
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="https://github.com/Preethi-23102000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
              title="Preethi"
            >
              Preethi
            </a>

            <span className="text-gray-600">|</span>
            <a
              href="https://github.com/mrinalsetty"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
              title="Mrinal"
            >
              Mrinal
            </a>
          </div>
          <div className="flex flex-col space-y-1 md:items-end text-sm">
            <a
              href="https://github.com/CS5610-NEU-Fall2025-SEC4/social-network-webdev-final-project"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-cyan-300 transition-colors"
            >
              <FaGithub /> <span>Frontend Repo</span>
            </a>
            <a
              href="https://github.com/CS5610-NEU-Fall2025-SEC4/social-network-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-cyan-300 transition-colors"
            >
              <FaGithub /> <span>Backend Repo</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
