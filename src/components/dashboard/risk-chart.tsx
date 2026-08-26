'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type DataPoint = { name: string; count: number }

const RISK_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#ef4444',
  Unscored: '#cbd5e1',
}

export function RiskChart({ data }: { data: DataPoint[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-navy-dark mb-3">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={RISK_COLORS[entry.name] ?? '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a1128',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
