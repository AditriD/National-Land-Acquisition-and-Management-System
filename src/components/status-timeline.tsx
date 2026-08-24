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
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-slate-700">Status History</h3>
      <ul className="space-y-2 border-l-2 border-slate-200 pl-4">
        {history.map((entry) => (
          <li key={entry.id} className="text-sm">
            <p>
              {entry.fromStage ? `${entry.fromStage} → ` : ''}
              <span className="font-medium">{entry.toStage}</span>
            </p>
            <p className="text-slate-400 text-xs">
              {new Date(entry.changedAt).toLocaleString()}
            </p>
            {entry.notes && <p className="text-slate-600 text-xs">{entry.notes}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}