type HistoryEntry = {
  id: string
  fromStage: string | null
  toStage: string
  changedAt: string | Date
  notes: string | null
}

export function StatusTimeline({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-500">No stage changes yet</p>
  }

  return (
    <Card>
      <h3 className="font-bold text-navy-dark text-sm mb-4">Status History</h3>
      <ul className="space-y-3 border-l-2 border-gold/30 pl-4">
        {history.map((entry) => (
          <li key={entry.id} className="text-sm relative">
            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gold border-2 border-white" />
            <p>
              {entry.fromStage ? `${entry.fromStage.replace(/_/g, ' ')} → ` : ''}
              <span className="font-semibold text-navy-dark">{entry.toStage.replace(/_/g, ' ')}</span>
            </p>
            <p className="text-slate-400 text-xs">
              {new Date(entry.changedAt).toLocaleString()}
            </p>
            {entry.notes && <p className="text-slate-600 text-xs mt-0.5">{entry.notes}</p>}
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm ${className ?? ''}`}>
      {children}
    </div>
  )
}
