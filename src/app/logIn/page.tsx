'use client'
import Link from 'next/link'

export default function logIn() {
  return (
    <div id="wdp-login-screen">
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Hello, Welcome Back!!</h2>
          <p className="text-gray-600 text-lg">Please log in to continue</p>
        </div>

        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="text-center">
            <Link
              href="/home"
              className="block bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-center no-underline"
            >
              Log In
            </Link>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            href="./register"
            className="block text-blue-600 hover:underline mb-2 text-sm font-medium"
          >
            New user? Register here for FREE!
          </Link>
          <Link href="./home" className="text-gray-600 hover:underline mb-2 text-sm font-medium">
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  )
}
