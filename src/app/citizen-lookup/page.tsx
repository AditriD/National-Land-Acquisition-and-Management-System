'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'

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
      <div className="min-h-screen bg-slate-50">
        {/* Header banner */}
        <div className="bg-navy-dark text-white py-8">
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gold" />
              </div>
              <h1 className="text-2xl font-bold">Your Parcel Status</h1>
            </div>
            <p className="text-sm text-slate-300">Survey No. {result.surveyNumber}</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <Card className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Project</span>
                <span className="text-sm font-semibold text-navy-dark">{result.projectName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Current Stage</span>
                <span className="gov-badge bg-navy/10 text-navy-dark">{result.status.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Compensation</span>
                <span className="text-sm font-semibold text-navy-dark">
                  {result.compensationAmount ? `₹${result.compensationAmount.toLocaleString()}` : 'Not yet determined'}
                  {' — '}
                  {result.compensationStatus}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-6 bg-gold text-navy-dark font-semibold hover:bg-gold-light"
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
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-navy-dark text-white py-8">
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gold" />
              </div>
              <h1 className="text-2xl font-bold">Verify your phone</h1>
            </div>
            <p className="text-sm text-slate-300">
              Enter the 6-digit code sent to <span className="font-medium">{phone}</span>
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <Card className="p-6 max-w-sm mx-auto">
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
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
              <Button type="submit" className="w-full bg-gold text-navy-dark font-semibold hover:bg-gold-light" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-sm text-slate-500 hover:text-navy-dark transition-colors w-full text-center"
              >
                Back
              </button>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-dark text-white py-10">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-7 h-7 text-gold" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Check Your Land Status</h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Enter your survey number and registered phone number to check the current status of your land acquisition.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <Card className="p-8 max-w-md mx-auto">
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
            <Button type="submit" className="w-full bg-gold text-navy-dark font-semibold hover:bg-gold-light" disabled={loading}>
              {loading ? 'Checking...' : (
                <span className="flex items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
