'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaEye } from 'react-icons/fa'
import { LuEyeClosed } from 'react-icons/lu'
import { useAuth } from '../context/AuthContext'

export default function LogIn() {
  const router = useRouter()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrorMessage('')
  }

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ username: formData.username, password: formData.password })
      setErrorMessage('')
      router.push('/home')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid username or password.'
      setErrorMessage(msg)
    }
  }

  return (
    <div id="wdp-login-screen">
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Hello, Welcome Back!!</h2>
          <p className="text-gray-600 text-lg">Please log in to continue</p>
        </div>

        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center">{errorMessage}</p>}
        <form onSubmit={handleLogIn}>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => {
                if (!formData.username.trim()) alert('Username cannot be empty')
              }}
              placeholder="Username"
              className="px-4 py-3 border border-gray-300 rounded-lg w-100"
            />
          </div>

          <div className="mb-4">
            <div className="relative w-full sm:w-auto sm:min-w-[400px]">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.password.trim()) alert('Password cannot be empty')
                }}
                placeholder="Password"
                className="px-4 py-3 border border-gray-300 rounded-lg w-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-[6px] rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
              >
                {showPassword ? <LuEyeClosed /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-center w-64"
              >
                Log In
              </button>
            </div>
          </div>
        </form>
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
