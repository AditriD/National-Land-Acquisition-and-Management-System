'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CreateAdminForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      setForm({ name: '', email: '', password: '' })
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create admin')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end mb-6">
      <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Add Admin'}</Button>
      {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </form>
  )
}