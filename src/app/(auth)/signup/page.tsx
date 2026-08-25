//signup
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
    setForm({ ...form, [field]: value })
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
      return}

    if (!EMAIL_REGEX.test(form.email)) {
      setError('Please enter a valid email address (e.g. name@example.com)')
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
    if ((form.role === 'STATE' || form.role === 'DISTRICT') && !form.state) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP')

      setStep('otp')
      startResendCooldown()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send verification code. Please try again.')
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to resend code')

      startResendCooldown()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend code. Please try again.')
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid code')

      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-6 w-full max-w-sm text-center">
          <h1 className="text-xl font-semibold mb-2 text-slate-900">Request submitted</h1>
          <p className="text-sm text-slate-500">
            Your email is verified and your account is pending admin approval.
          </p>
        </Card>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-6 w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-2 text-slate-900">Verify your email</h1>
          <p className="text-sm text-slate-500 mb-6">
            Enter the 6-digit code sent to <span className="font-medium">{form.email}</span>
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
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </Button>
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => setStep('form')}
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10">
      <Card className="p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-2 text-slate-900">Create an account</h1>
        <p className="text-sm text-slate-500 mb-6">Fill in the details to get started.</p>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
          />
          <Select
            value={form.role}
            onValueChange={(value) => {
              const newRole = value ?? ''
              if (newRole === 'CENTRAL') {
                setForm({ ...form, role: newRole, state: '', district: '' })
              } else {
                update('role', newRole)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CENTRAL">Central</SelectItem>
              <SelectItem value="STATE">State</SelectItem>
              <SelectItem value="DISTRICT">District</SelectItem>
              <SelectItem value="AGENCY">Agency</SelectItem>
            </SelectContent>
          </Select>
          {(form.role === 'STATE' || form.role === 'DISTRICT') && (
            <Input
              placeholder="State"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
            />
          )}
          {form.role === 'DISTRICT' && (
            <Input
              placeholder="District"
              value={form.district}
              onChange={(e) => update('district', e.target.value)}
            />
          )}
          {form.role === 'AGENCY' && (
            <Input
              placeholder="Agency Name (e.g. NHAI)"
              value={form.agencyName}
              onChange={(e) => update('agencyName', e.target.value)}
            />
          )}
          <Input
            placeholder="Verification Document URL"
            value={form.verificationDocUrl}
            onChange={(e) => update('verificationDocUrl', e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Sending code...' : 'Continue'}
          </Button>
        </form>
        <p className="text-sm text-slate-500 text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
          Log in
          </Link>
        </p>
      </Card>
    </div>
  )
}