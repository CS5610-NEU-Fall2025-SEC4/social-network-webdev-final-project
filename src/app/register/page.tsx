'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaEye } from 'react-icons/fa'
import { LuEyeClosed } from 'react-icons/lu'

export default function Register() {
  const router = useRouter()

  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  //valdiate the passwords before submission
  // Regex explanation:
  // (?=.*[a-z]) → must include at least one lowercase letter
  // (?=.*[A-Z]) → must include at least one uppercase letter
  // (?=.*\d) → must include at least one number
  // (?=.*[@_.]) → must include at least one special character among @, _, or .
  // {8,} → at least 8 characters total
  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_.])[A-Za-z\d@_.]{8,}$/
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
            <li>At least one special character (@, _, . etc.)</li>
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
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordValid) {
      alert('Please enter a valid password before proceeding.')
      return
    }
    if (!passwordsMatch()) return

    try {
      const res = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        alert(data.message || 'Registration successful!')
        router.push('/logIn')
      } else {
        alert(data.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again later.')
    }
  }

  return (
    <div id="wdp-login-screen">
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Hello, Welcome to the Family.</h2>
          <p className="text-gray-600 text-lg">Please Enter details below to register.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Enter your First Name:
              </span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.firstName.trim()) alert('First name cannot be empty')
                }}
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
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.lastName.trim()) alert('Last name cannot be empty')
                }}
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => {
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    alert('Please enter a valid email address')
                  }
                }}
                placeholder="email@website.com"
                className="px-4 py-3 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[400px]"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Enter your Username:
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.username.trim()) alert('Username cannot be empty')
                }}
                placeholder="username"
                className="px-4 py-3 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[400px]"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Enter your Password:
              </span>

              <div className="relative w-full sm:w-auto sm:min-w-[400px]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  className="px-4 py-3 border border-gray-300 rounded-lg w-full pr-20"
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
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              {passwordError && (
                <div className="text-red-600 mt-2 text-sm sm:ml-[10.2rem] ml-0 sm:w-[400px]">
                  {passwordError}
                </div>
              )}

              {passwordValid && formData.password.length > 0 && (
                <p className="text-green-600 text-sm mt-1 text-center sm:text-left sm:ml-[10.2rem] sm:w-[400px]">
                  ✅ Strong password
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="text-gray-800 mb-2 sm:mb-0 sm:w-40 text-right">
                Verify Password:
              </span>
              <div className="relative w-full sm:w-auto sm:min-w-[400px]">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={passwordsMatch}
                  placeholder="Verify Password"
                  className="px-4 py-3 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[400px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-[6px] rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  {showConfirmPassword ? <LuEyeClosed /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-center">
            <button
              type="submit"
              className="block bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-center w-64"
            >
              Register
            </button>
          </div>
        </form>
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
