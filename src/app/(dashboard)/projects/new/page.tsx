'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NewProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    ministry: 'MoRD',
    implementingAgency: '',
    state: '',
    sector: '',
    targetCompletion: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Wait for session to load before deciding anything
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  const role = session?.user?.role
  const canCreate = role === 'CENTRAL' || role === 'STATE'

  if (!canCreate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-6 w-full max-w-sm text-center">
          <h1 className="text-lg font-semibold mb-2 text-slate-900">Not authorized</h1>
          <p className="text-sm text-slate-500">
            You don&apos;t have permission to create projects.
          </p>
        </Card>
      </div>
    )
  }

  // STATE users: state field is locked to their own state
  const isStateUser = role === 'STATE'
  const effectiveState = isStateUser ? session?.user?.state ?? '' : form.state

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.implementingAgency || !form.sector) {
      setError('Please fill in all required fields')
      return
    }
    if (!effectiveState) {
      setError('State is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, state: effectiveState }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create project')

      router.push(`/projects/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 max-w-lg mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-6">New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Implementing Agency (e.g. NHAI)"
          value={form.implementingAgency}
          onChange={(e) => setForm({ ...form, implementingAgency: e.target.value })}
        />

        {isStateUser ? (
          <Input placeholder="State" value={effectiveState} disabled />
        ) : (
          <Input
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
        )}

        <Input
          placeholder="Sector (Highway/Irrigation/Railway)"
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
        />
        <Input
          type="date"
          value={form.targetCompletion}
          onChange={(e) => setForm({ ...form, targetCompletion: e.target.value })}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </Card>
  )
}