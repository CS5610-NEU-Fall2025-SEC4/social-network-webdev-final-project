'use client'
import Link from 'next/link'

export default function register() {
  return (
    <div id="wdp-login-screen">
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Hello, Welcome to the Family.</h2>
          <p className="text-gray-600 text-lg">Please Enter details below to register.</p>
        </div>

        <div>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Enter your First Name:
              </span>
              <input
                type="text"
                placeholder="First Name"
                className="px-4 py-3 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[400px]"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Enter your Last Name:
              </span>
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-3 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[400px]"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Enter your E-mail:
              </span>
              <input
                type="email"
                placeholder="email@website.com"
                className="px-4 py-3 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[400px]"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Enter your Password:
              </span>
              <input
                type="password"
                placeholder="Password"
                className="px-4 py-3 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[400px]"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Verify Password:
              </span>
              <input
                type="password"
                placeholder="Verify Password"
                className="px-4 py-3 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[400px]"
              />
            </div>
          </div>

          <div className="flex justify-center text-center">
            <Link
              href="#"
              onClick={() => alert('Navigate to Profile — not yet implemented!')}
              className="block bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-center w-64"
            >
              Register
            </Link>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            href="./logIn"
            className="block text-blue-600 hover:underline mb-2 text-sm font-medium"
          >
            Already have an account? Log In here!
          </Link>
          <Link href="./home" className="text-gray-600 hover:underline mb-2 text-sm font-medium">
            Changed your mind? No worries, Continue as Guest.
          </Link>
        </div>
      </div>
    </div>
  )
}
