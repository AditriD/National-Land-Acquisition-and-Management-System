//login
'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Step = 'credentials' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1 text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-6">Log in to your account</p>
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Checking...' : 'Continue'}
          </Button>
        </form>
        <p className="text-sm text-slate-500 text-center mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
          Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}