'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Props = {
  completed: number
  inProgress: number
  pending: number
  overallProgressPct: number
}

const COLORS: Record<string, string> = {
  Completed: '#16a34a',
  'In Progress': '#2563eb',
  Pending: '#eab308',
}

export function ProgressDonut({ completed, inProgress, pending, overallProgressPct }: Props) {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending', value: pending },
  ]

  return (
    <div className="relative flex items-center justify-center w-[180px] h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={82}
            paddingAngle={3}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-navy-dark">{overallProgressPct}%</span>
      </div>
    </div>
  )
}