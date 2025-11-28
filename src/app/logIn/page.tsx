'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaEye } from 'react-icons/fa'
import { LuEyeClosed } from 'react-icons/lu'
import { useAuth } from '../context/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function LogIn() {
  const router = useRouter()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: '',
  })

  const [message, setMessage] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setMessage('')
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({ ...fieldErrors, [name]: '' })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let error = ''

    if (name === 'username' && !value.trim()) {
      error = 'Username cannot be empty'
    } else if (name === 'password' && !value.trim()) {
      error = 'Password cannot be empty'
    }

    setFieldErrors({ ...fieldErrors, [name]: error })
  }

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ username: formData.username, password: formData.password })
      setMessage('Logging In')
      const storedProfile = localStorage.getItem('userProfile')
      if (storedProfile) {
        const profile = JSON.parse(storedProfile)

        if (profile.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/home')
        }
      } else {
        router.push('/home')
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message.includes('blocked')
            ? '⚠️ Your account has been blocked. Please contact support.'
            : err.message.includes('empty')
              ? 'Username or Password cannot be empty'
              : err.message
          : 'Invalid username or password.'
      setMessage(msg)
    }
  }

  return (
    <div
      id="wdp-login-screen"
      className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Hello, Welcome Back!!</CardTitle>
          <CardDescription className="text-lg">Please log in to continue</CardDescription>
        </CardHeader>

        <CardContent>
          {message && (
            <p
              className={`${message.includes('Logging') ? 'text-green-600' : 'text-red-600'} text-sm mb-4 text-center bg-red-50 p-3 rounded-md`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleLogIn} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-800 mb-2 sm:mb-0 sm:w-32 text-left sm:text-right sm:whitespace-nowrap">
                Username:
              </label>
              <div className="flex-1 sm:flex-initial sm:w-[600px]">
                {fieldErrors.username && (
                  <p className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded-md">
                    {fieldErrors.username}
                  </p>
                )}
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Username"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-800 mb-2 sm:mb-0 sm:w-32 text-left sm:text-right sm:whitespace-nowrap">
                Password:
              </label>
              <div className="relative flex-1 sm:flex-initial sm:w-[600px]">
                {fieldErrors.password && (
                  <p className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded-md">
                    {fieldErrors.password}
                  </p>
                )}
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    className="w-full pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <FaEye className="h-4 w-4" />
                    ) : (
                      <LuEyeClosed className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" size="lg" className="w-64">
                Log In
              </Button>
            </div>
          </form>
          <div className="text-center mt-8 space-y-2">
            <div>
              <Link href="./register" className="text-blue-600 hover:underline text-sm font-medium">
                New user? Register here for FREE!
              </Link>
            </div>
            <div>
              <Link href="./home" className="text-gray-600 hover:underline text-sm font-medium">
                Continue as Guest
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
