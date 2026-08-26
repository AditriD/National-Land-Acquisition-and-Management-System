'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BackButton } from '@/components/back-button'

export default function NewParcelPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId') ?? ''

  const [form, setForm] = useState({
    surveyNumber: '',
    latitude: '',
    longitude: '',
    areaHectares: '',
    district: '',
    ownerName: '',
    ownerPhone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  const role = session?.user?.role
  const canCreate = role === 'DISTRICT' || role === 'STATE' || role === 'AGENCY'

  if (!canCreate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-6 w-full max-w-sm text-center">
          <h1 className="text-lg font-semibold mb-2 text-slate-900">Not authorized</h1>
          <p className="text-sm text-slate-500">
            You don&apos;t have permission to create parcels.
          </p>
        </Card>
      </div>
    )
  }

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-6 w-full max-w-sm text-center">
          <h1 className="text-lg font-semibold mb-2 text-slate-900">Missing project</h1>
          <p className="text-sm text-slate-500">
            No project specified. Go to a project page and click &quot;Add Parcel&quot; from there.
          </p>
        </Card>
      </div>
    )
  }

  const isDistrictUser = role === 'DISTRICT'
  const effectiveDistrict = isDistrictUser ? session?.user?.district ?? '' : form.district

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.surveyNumber || !form.latitude || !form.longitude || !form.areaHectares) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/parcels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          surveyNumber: form.surveyNumber,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
          areaHectares: parseFloat(form.areaHectares),
          district: effectiveDistrict,
          ownerName: form.ownerName,
          ownerPhone: form.ownerPhone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create parcel')

      router.push(`/projects/${projectId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto p-6">
        <div className="mb-6">
          <BackButton />
        </div>
        <Card className="p-8">
          <h1 className="text-xl font-bold text-navy-dark mb-6">New Land Parcel</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Survey Number"
              value={form.surveyNumber}
              onChange={(e) => setForm({ ...form, surveyNumber: e.target.value })}
            />
            <div className="flex gap-4">
              <Input
                placeholder="Latitude"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
              <Input
                placeholder="Longitude"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              />
            </div>
            <Input
              placeholder="Area (hectares)"
              value={form.areaHectares}
              onChange={(e) => setForm({ ...form, areaHectares: e.target.value })}
            />

            {isDistrictUser ? (
              <Input placeholder="District" value={effectiveDistrict} disabled className="bg-slate-50" />
            ) : (
              <Input
                placeholder="District"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            )}

            <Input
              placeholder="Owner Name"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            />
            <Input
              placeholder="Owner Phone"
              value={form.ownerPhone}
              onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-dark text-white font-semibold hover:bg-navy"
            >
              {loading ? 'Creating...' : 'Add Parcel'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
