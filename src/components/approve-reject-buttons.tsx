'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function ApproveRejectButtons({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')

  async function submit(decision: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
    setLoading(true)
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, decision, rejectionReason }),
    })
    setLoading(false)
    if (res.ok) {
      router.refresh()
    }
  }

  if (rejecting) {
    return (
      <div className="flex gap-2 items-center">
        <input
          className="border rounded px-2 py-1 text-sm w-40"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button size="sm" variant="destructive" disabled={loading} onClick={() => submit('REJECTED', reason)}>
          Confirm
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setRejecting(false)}>Cancel</Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" disabled={loading} onClick={() => submit('APPROVED')}>Approve</Button>
      <Button size="sm" variant="outline" disabled={loading} onClick={() => setRejecting(true)}>Reject</Button>
    </div>
  )
}