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

export default function Register() {
  const router = useRouter()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [passwordError, setPasswordError] = useState<React.ReactNode>('')
  const [passwordValid, setPasswordValid] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === 'username') {
      setUsernameError('')
    }

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({ ...fieldErrors, [name]: '' })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let error = ''

    if (name === 'firstName' && !value.trim()) {
      error = 'First Name cannot be empty'
    } else if (name === 'lastName' && !value.trim()) {
      error = 'Last Name cannot be empty'
    } else if (name === 'email' && !value.trim()) {
      error = 'Email cannot be empty'
    } else if (name === 'username' && !value.trim()) {
      error = 'Username cannot be empty'
    } else if (name === 'password' && !value.trim()) {
      error = 'Password cannot be empty'
    } else if (name === 'confirmPassword' && !value.trim()) {
      error = 'Verify Password cannot be empty'
    }

    setFieldErrors({ ...fieldErrors, [name]: error })
  }

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username.trim()) {
      setUsernameError('Username cannot be empty')
      return false
    }

    setIsCheckingUsername(true)
    try {
      const hnResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/checkHnUsername/${username}`,
      )
      const hnData = await hnResponse.json()

      const mongoResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/checkUsername/${username}`,
      )
      const mongoData = await mongoResponse.json()

      if (hnData.exists || mongoData.exists) {
        setUsernameError(
          `Username "${username}" is already taken. Please choose a different username.`,
        )
        return false
      }

      setUsernameError('')
      return true
    } catch (error) {
      console.error('Error checking username availability:', error)
      setUsernameError('Error checking username availability. Please try again.')
      return false
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const handleUsernameBlur = async () => {
    if (formData.username.trim()) {
      await checkUsernameAvailability(formData.username)
    } else {
      setFieldErrors({ ...fieldErrors, username: 'Username cannot be Empty' })
    }
  }

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/
    return regex.test(password)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, password: value })

    if (!validatePassword(value)) {
      setPasswordValid(false)
      setPasswordError(
        <div className="text-left">
          <p>Password must include:</p>
          <ul className="list-disc ml-6 text-sm text-red-600">
            <li>At least one lowercase letter</li>
            <li>At least one uppercase letter</li>
            <li>At least one digit (0–9)</li>
            <li>At least one special character (e.g., ! @ # $ % ^ & * . _ -)</li>
            <li>Minimum length of 8 characters</li>
          </ul>
        </div>,
      )
    } else {
      setPasswordValid(true)
      setPasswordError('')
    }
  }

  const passwordsMatch = (): boolean => {
    return formData.password === formData.confirmPassword
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: string[] = []

    if (!formData.firstName.trim()) {
      errors.push('First name cannot be empty')
    }
    if (!formData.lastName.trim()) {
      errors.push('Last name cannot be empty')
    }
    if (!formData.email.trim()) {
      errors.push('Email cannot be empty')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address')
    }
    if (!formData.username.trim()) {
      errors.push('Username cannot be empty')
    }
    if (!passwordValid) {
      errors.push('Please enter a valid password')
    }
    if (!passwordsMatch()) {
      errors.push('Passwords do not match')
    }

    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n• ' + errors.join('\n• '))
      return
    }

    const isUsernameAvailable = await checkUsernameAvailability(formData.username)
    if (!isUsernameAvailable) {
      alert('Please fix the username error before submitting.')
      return
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      alert('Registration successful!')
      router.push('/logIn')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      alert(msg)
    }
  }

  return (
    <div
      id="wdp-register-screen"
      className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4"
    >
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Hello, Welcome to the Family.</CardTitle>
          <CardDescription className="text-lg">
            Please enter details below to register.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-800 mb-2 sm:mb-0 sm:w-48 text-left sm:text-right sm:whitespace-nowrap">
                Enter your First Name:
              </label>
              <div className="flex-1 sm:flex-initial sm:w-[600px]">
                {fieldErrors.firstName && (
                  <p className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded-md">
                    {fieldErrors.firstName}
                  </p>
                )}
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="First Name"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-800 mb-2 sm:mb-0 sm:w-48 text-left sm:text-right sm:whitespace-nowrap">
                Enter your Last Name:
              </label>
              <div className="flex-1 sm:flex-initial sm:w-[600px]">
                {fieldErrors.lastName && (
                  <p className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded-md">
                    {fieldErrors.lastName}
                  </p>
                )}
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Last Name"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-800 mb-2 sm:mb-0 sm:w-48 text-left sm:text-right sm:whitespace-nowrap">
                Enter your E-mail:
              </label>
              <div className="flex-1 sm:flex-initial sm:w-[600px]">
                {fieldErrors.email && (
                  <p className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded-md">
                    {fieldErrors.email}
                  </p>
                )}
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="email@website.com"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
              <label className="text-gray-800 mb-2 sm:mb-0 sm:w-48 text-left sm:text-right sm:mt-3 sm:whitespace-nowrap">
                Enter your Username:
              </label>
              <div className="flex-1 sm:flex-initial sm:w-[600px]">
                <div className="relative">
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
                    onBlur={handleUsernameBlur}
                    placeholder="username"
                    className={`w-full ${usernameError ? 'border-red-500' : ''}`}
                    disabled={isCheckingUsername}
                    aria-invalid={!!usernameError}
                  />
                  {isCheckingUsername && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      Checking...
                    </span>
                  )}
                </div>
                {usernameError && <p className="text-red-600 text-sm mt-1">{usernameError}</p>}
                {!usernameError && formData.username && !isCheckingUsername && (
                  <p className="text-green-600 text-sm mt-1">✅ Username available</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-800 mb-2 sm:mb-0 sm:w-48 text-left sm:text-right sm:whitespace-nowrap">
                Enter your Password:
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
                    onChange={handlePasswordChange}
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

            {(passwordError || passwordValid) && (
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                <div className="sm:w-48" />
                <div className="flex-1 sm:flex-initial sm:w-[600px]">
                  {passwordError && <div className="text-red-600 text-sm">{passwordError}</div>}
                  {passwordValid && formData.password.length > 0 && (
                    <p className="text-green-600 text-sm">✅ Strong password</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="text-gray-800 mb-2 sm:mb-0 sm:w-48 text-left sm:text-right sm:whitespace-nowrap">
                Verify Password:
              </label>
              <div className="relative flex-1 sm:flex-initial sm:w-[600px]">
                {fieldErrors.confirmPassword && (
                  <p className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded-md">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Verify Password"
                    className="w-full pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <FaEye className="h-4 w-4" />
                    ) : (
                      <LuEyeClosed className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" size="lg" className="w-64" disabled={isCheckingUsername}>
                {isCheckingUsername ? 'Checking...' : 'Register'}
              </Button>
            </div>
          </form>

          <div className="text-center mt-8 space-y-2">
            <div>
              <Link href="./logIn" className="text-blue-600 hover:underline text-sm font-medium">
                Already have an account? Log In here!
              </Link>
            </div>
            <div>
              <Link href="./home" className="text-gray-600 hover:underline text-sm font-medium">
                Changed your mind? No worries, Continue as Guest.
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
