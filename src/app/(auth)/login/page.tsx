//login
'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react'

type Step = 'credentials' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('credentials')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

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

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    try {
      // Real check: correct password AND account approved?
      const res = await fetch('/api/auth/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please try again.')
      }

      const otpRes = await fetch('/api/auth/send-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const otpData = await otpRes.json()
      if (!otpRes.ok) throw new Error(otpData.error || 'Failed to send verification code')

      setStep('otp')
      startResendCooldown()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to resend code')

      startResendCooldown()
    } catch (err) {
      setError('Could not resend code. Please try again.')
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
      const res = await signIn('credentials', {
        email,
        password,
        otp,
        redirect: false,
      })

      if (res?.error) {
        throw new Error(res.error)
      }

      // fetch the session to know where to send them
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const role = session?.user?.role

      const roleRoutes: Record<string, string> = {
        ADMIN: '/admin',
        CENTRAL: '/central',
        STATE: '/state',
        DISTRICT: '/district',
        AGENCY: '/agency',
      }
      router.push(roleRoutes[role] ?? '/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-6 w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-2 text-slate-900">Enter verification code</h1>
          <p className="text-sm text-slate-500 mb-6">
            Enter the 6-digit code sent to <span className="font-medium">{email}</span>
          </p>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              maxLength={6}
              className="text-center tracking-widest text-lg"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Log In'}
            </Button>
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-slate-500 hover:underline"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                className="text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/login.jpg')" }}
    >

      {/* Dark overlay over the background */}
      <div className="absolute inset-0 bg-[#071426]/80" />

      <div className="relative w-full max-w-sm">

        <div className="rounded-2xl bg-[#f8fafc]/95 backdrop-blur-md shadow-2xl p-6 sm:p-8">

          {/* Header */}

          <div className="mb-6">

            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#071426] text-white mb-4">
              <ShieldCheck size={20} />
            </div>

            <p className="text-xs font-semibold tracking-[0.2em] text-[#b17a08] mb-1">
              SECURE ACCESS
            </p>

            <h2 className="text-2xl font-serif font-semibold text-[#071426]">
              Welcome back
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              Sign in to your National Land Acquisition dashboard.
            </p>

          </div>


          {/* Login form */}

          <form
            onSubmit={handleCredentialsSubmit}
            className="space-y-4"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Official Email
              </label>

              <Input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg border-slate-300 bg-white focus:border-[#b17a08] focus:ring-[#b17a08]/20"
              />

            </div>


            {/* Password */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>

              <div className="relative">

                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-lg border-slate-300 bg-white pr-11 focus:border-[#b17a08] focus:ring-[#b17a08]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >

                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}

                </button>

              </div>

            </div>


            {/* Error */}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}


            {/* Continue */}

            <Button
              type="submit"
              disabled={loading}
              className="group w-full h-11 rounded-lg bg-[#071426] hover:bg-[#102640] text-white font-semibold"
            >

              {loading ? (
                'Checking...'
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


          {/* Signup */}

          <div className="relative my-5">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-[#f8fafc] px-3 text-xs text-slate-400">
                NEW TO THE PLATFORM?
              </span>
            </div>

          </div>


          <Link
            href="/signup"
            className="w-full h-11 rounded-lg border border-slate-300 bg-white text-[#071426] text-sm font-medium flex items-center justify-center hover:bg-slate-50 transition"
          >
            Create an account
          </Link>


          {/* Back home */}

          <div className="text-center mt-5">

            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-[#071426] transition"
            >
              ← Back to home
            </Link>

          </div>


          {/* Security */}

          <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-400">

            <ShieldCheck size={13} />

            Secure & role-based government access

          </div>

        </div>

      </div>

    </main>
  )
}