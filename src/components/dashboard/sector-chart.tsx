'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type DataPoint = { name: string; count: number }

export function SectorChart({ data }: { data: DataPoint[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-navy-dark mb-3">Projects by Sector</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(26,39,68,0.04)' }}
            contentStyle={{
              backgroundColor: '#0a1128',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '13px',
              padding: '8px 12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}
            labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}
            itemStyle={{ color: '#fff', fontWeight: 600 }}
          />
          <Bar dataKey="count" fill="#1a2744" radius={[6, 6, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
