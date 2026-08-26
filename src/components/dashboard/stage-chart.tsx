'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type DataPoint = { name: string; count: number }

export function StageChart({ data }: { data: DataPoint[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-navy-dark mb-3">Parcels by Stage</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-30} textAnchor="end" interval={0} />
          <YAxis allowDecimals={false} tick={{ fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a1128',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Bar dataKey="count" fill="#c8952d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
