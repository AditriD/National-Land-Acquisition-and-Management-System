'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const STAGE_ORDER = [
  'PROPOSAL_SUBMITTED', 'UNDER_SCRUTINY', 'NOTIFICATION_ISSUED',
  'AWARD_DECLARED', 'COMPENSATION_DISBURSED', 'POSSESSION_TAKEN', 'RR_COMPLETED',
]

export function AdvanceStageButton({ parcelId, currentStage }: { parcelId: string; currentStage: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isFinal = STAGE_ORDER.indexOf(currentStage) === STAGE_ORDER.length - 1

  async function handleAdvance() {
    setLoading(true)
    setError('')
    const res = await fetch(`/api/parcels/${parcelId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: '' }),
    })
    setLoading(false)
    if (res.ok) {
      router.refresh()
    } else {
      const body = await res.json()
      setError(body.error ?? 'Failed to advance stage')
    }
  }

  if (isFinal) return <p className="text-sm text-slate-500">Final stage reached</p>

  return (
    <div>
      <Button onClick={handleAdvance} disabled={loading}>
        {loading ? 'Advancing...' : 'Advance to Next Stage'}
      </Button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}