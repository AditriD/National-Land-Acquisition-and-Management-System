'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type DataPoint = { name: string; count: number }

const RISK_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#ef4444',
  Unscored: '#cbd5e1',
}

const RISK_LABELS: Record<string, string> = {
  LOW: 'Low Risk',
  MEDIUM: 'Medium Risk',
  HIGH: 'High Risk',
  Unscored: 'Unscored',
}

export function RiskChart({ data }: { data: DataPoint[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-navy-dark mb-3">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="48%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            stroke="none"
            label={({ name, value }: { name?: string; value?: number }) => `${RISK_LABELS[name ?? ''] ?? name}: ${value}`}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={RISK_COLORS[entry.name] ?? '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip
            cursor={false}
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
            formatter={(value: unknown, name: unknown) => [`${value} parcels`, RISK_LABELS[String(name)] ?? String(name)]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-slate-600">{RISK_LABELS[value] ?? value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
