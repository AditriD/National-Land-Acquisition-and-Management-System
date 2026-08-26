'use client'

import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import Link from 'next/link'
import { ShieldCheck, ArrowRight } from 'lucide-react'

type Step = 'form' | 'otp' | 'success'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    state: '',
    district: '',
    agencyName: '',
    verificationDocUrl: '',
  })

  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  function update(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function startResendCooldown() {
    setResendCooldown(30)

    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }

        return prev - 1
      })
    }, 1000)
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.password) {
      setError('Please fill in all required fields')
      return
    }

    if (!EMAIL_REGEX.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!form.role) {
      setError('Please select a role')
      return
    }

    if (
      (form.role === 'STATE' || form.role === 'DISTRICT') &&
      !form.state
    ) {
      setError('State is required for this role')
      return
    }

    if (form.role === 'DISTRICT' && !form.district) {
      setError('District is required for this role')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setStep('otp')
      startResendCooldown()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not send verification code. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code')
      }

      startResendCooldown()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not resend code. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Enter the 6-digit code sent to your email')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp,
          form,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid code')
      }

      setStep('success')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid or expired code. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // SUCCESS PAGE
  if (step === 'success') {
    return (
      <main
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/signup.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#071426]/80" />

        <div className="relative z-10 w-full max-w-md">
          <Card className="rounded-2xl bg-[#f8fafc]/95 backdrop-blur-md shadow-2xl p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#071426] text-white mb-4">
                <ShieldCheck size={20} />
              </div>

              <p className="text-xs font-semibold tracking-[0.2em] text-[#b17a08] mb-1">
                REGISTRATION COMPLETE
              </p>

              <h2 className="text-2xl font-serif font-semibold text-[#071426]">
                Request submitted
              </h2>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Your email is verified and your account is pending admin approval.
              </p>
            </div>

            <Link
              href="/login"
              className="mt-6 w-full h-11 rounded-lg border border-slate-300 bg-white text-[#071426] text-sm font-medium flex items-center justify-center hover:bg-slate-50 transition"
            >
              Back to login
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  // OTP PAGE
  if (step === 'otp') {
    return (
      <main
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/signup.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#071426]/80" />

        <div className="relative z-10 w-full max-w-md">
          <Card className="rounded-2xl bg-[#f8fafc]/95 backdrop-blur-md shadow-2xl p-6 sm:p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#071426] text-white mb-4">
                <ShieldCheck size={20} />
              </div>

              <p className="text-xs font-semibold tracking-[0.2em] text-[#b17a08] mb-1">
                EMAIL VERIFICATION
              </p>

              <h2 className="text-2xl font-serif font-semibold text-[#071426]">
                Verify your email
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                Enter the 6-digit code sent to {form.email}
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Verification Code
                </label>

                <Input
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  inputMode="numeric"
                  maxLength={6}
                  className="h-11 rounded-lg border-slate-300 bg-white text-center tracking-widest text-lg"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="group w-full h-11 rounded-lg bg-[#071426] hover:bg-[#102640] text-white font-semibold"
              >
                {loading ? (
                  'Verifying...'
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Verify & Create Account
                    <ArrowRight size={16} />
                  </span>
                )}
              </Button>

              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep('form')
                    setError('')
                  }}
                  className="text-slate-500 hover:text-[#071426]"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-[#b17a08] hover:underline disabled:text-slate-400"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend code'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    )
  }

  // SIGNUP PAGE
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/signup.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#071426]/80" />

      {/* Wider and proportional signup card */}
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="rounded-2xl bg-[#f8fafc]/95 backdrop-blur-md shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#071426] text-white mb-4">
              <ShieldCheck size={20} />
            </div>

            <p className="text-xs font-semibold tracking-[0.2em] text-[#b17a08] mb-1">
              SECURE REGISTRATION
            </p>

            <h2 className="text-2xl font-serif font-semibold text-[#071426]">
              Create an account
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              Register for access to the National Land Acquisition platform.
            </p>
          </div>

          {/* 2-column proportional form */}
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <Input
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="h-11 rounded-lg border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Official Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your official email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="h-11 rounded-lg border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="h-11 rounded-lg border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Role
                </label>
                <Select
                  value={form.role}
                  onValueChange={(value) => {
                    const newRole = value ?? ''

                    setForm((prev) => ({
                      ...prev,
                      role: newRole,
                      state:
                        newRole === 'STATE' || newRole === 'DISTRICT'
                          ? prev.state
                          : '',
                      district:
                        newRole === 'DISTRICT'
                          ? prev.district
                          : '',
                      agencyName:
                        newRole === 'AGENCY'
                          ? prev.agencyName
                          : '',
                    }))
                  }}
                >
                  <SelectTrigger className="h-11 rounded-lg border-slate-300 bg-white">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="CENTRAL">Central</SelectItem>
                    <SelectItem value="STATE">State</SelectItem>
                    <SelectItem value="DISTRICT">District</SelectItem>
                    <SelectItem value="AGENCY">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(form.role === 'STATE' || form.role === 'DISTRICT') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    State
                  </label>
                  <Input
                    placeholder="Enter state"
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    className="h-11 rounded-lg border-slate-300 bg-white"
                  />
                </div>
              )}

              {form.role === 'DISTRICT' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    District
                  </label>
                  <Input
                    placeholder="Enter district"
                    value={form.district}
                    onChange={(e) => update('district', e.target.value)}
                    className="h-11 rounded-lg border-slate-300 bg-white"
                  />
                </div>
              )}

              {form.role === 'AGENCY' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Agency Name
                  </label>
                  <Input
                    placeholder="Enter agency name"
                    value={form.agencyName}
                    onChange={(e) => update('agencyName', e.target.value)}
                    className="h-11 rounded-lg border-slate-300 bg-white"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Verification Document URL
                </label>
                <Input
                  placeholder="Enter verification document URL"
                  value={form.verificationDocUrl}
                  onChange={(e) =>
                    update('verificationDocUrl', e.target.value)
                  }
                  className="h-11 rounded-lg border-slate-300 bg-white"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="group w-full h-11 rounded-lg bg-[#071426] hover:bg-[#102640] text-white font-semibold"
            >
              {loading ? (
                'Sending code...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              )}
            </Button>
          </form>

          {/* Login Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-[#f8fafc] px-3 text-xs text-slate-400">
                ALREADY REGISTERED?
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full h-11 rounded-lg border border-slate-300 bg-white text-[#071426] text-sm font-medium flex items-center justify-center hover:bg-slate-50 transition"
          >
            Log in to your account
          </Link>

          <div className="text-center mt-5">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-[#071426] transition"
            >
              ← Back to home
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-400">
            <ShieldCheck size={13} />
            Secure & role-based government access
          </div>
        </Card>
      </div>
    </main>
  )
}