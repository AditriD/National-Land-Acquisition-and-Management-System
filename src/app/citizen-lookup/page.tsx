'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Step = 'form' | 'otp' | 'result'

type ParcelResult = {
  surveyNumber: string
  status: string
  compensationAmount: number | null
  compensationStatus: string
  riskLevel: string
  projectName: string
}

export default function CitizenLookupPage() {
  const [surveyNumber, setSurveyNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ParcelResult | null>(null)

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!surveyNumber.trim() || !phone.trim()) {
      setError('Please enter both survey number and phone number')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/citizen/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyNumber, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No matching record found')

      setStep('otp')
      // Demo convenience: show the simulated OTP directly since there's no real SMS gateway
      if (data.simulatedOtp) {
        console.log('Simulated OTP (demo only):', data.simulatedOtp)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/citizen/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyNumber, phone, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid code')

      setResult(data.parcel)
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'result' && result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="p-6 w-full max-w-md">
          <h1 className="text-xl font-semibold mb-1 text-slate-900">Your Parcel Status</h1>
          <p className="text-sm text-slate-500 mb-6">Survey No. {result.surveyNumber}</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-slate-500">Project</span>
              <span className="text-sm font-medium">{result.projectName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-slate-500">Current Stage</span>
              <span className="text-sm font-medium">{result.status.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-slate-500">Compensation</span>
              <span className="text-sm font-medium">
                {result.compensationAmount ? `₹${result.compensationAmount.toLocaleString()}` : 'Not yet determined'}
                {' — '}
                {result.compensationStatus}
              </span>
            </div>
          </div>
          <Button
            className="w-full mt-6"
            variant="outline"
            onClick={() => {
              setStep('form')
              setSurveyNumber('')
              setPhone('')
              setOtp('')
              setResult(null)
            }}
          >
            Look up another parcel
          </Button>
        </Card>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="p-6 w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-2 text-slate-900">Verify your phone</h1>
          <p className="text-sm text-slate-500 mb-6">
            Enter the 6-digit code sent to <span className="font-medium">{phone}</span>
          </p>
          <p className="text-xs text-amber-600 bg-amber-50 rounded p-2 mb-4">
            Demo mode: check your browser console for the simulated code.
          </p>
          <form onSubmit={handleVerify} className="space-y-4">
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
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="text-sm text-slate-500 hover:underline w-full text-center"
            >
              Back
            </button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1 text-slate-900">Check Your Land Status</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter your survey number and registered phone number.
        </p>
        <form onSubmit={handleLookup} className="space-y-4">
          <Input
            placeholder="Survey Number"
            value={surveyNumber}
            onChange={(e) => setSurveyNumber(e.target.value)}
          />
          <Input
            placeholder="Registered Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Checking...' : 'Continue'}
          </Button>
        </form>
      </Card>
    </div>
  )
}