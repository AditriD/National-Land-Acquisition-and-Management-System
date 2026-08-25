'use client'
import dynamic from 'next/dynamic'

const ParcelMap = dynamic(() => import('@/components/parcel-map').then((m) => m.ParcelMap), {
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center text-slate-400">Loading map…</div>,
})

export { ParcelMap }