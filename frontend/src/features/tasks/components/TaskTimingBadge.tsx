import { taskTimingLabel } from '../utils/taskDates'

export function TaskTimingBadge({ startDate, deadline, status }: { startDate: string; deadline: string; status: string }) {
  const label = taskTimingLabel(startDate, deadline, status)
  const color = label === 'Overdue' ? 'bg-rose-100 text-rose-800' : label === 'Due soon' ? 'bg-amber-100 text-amber-900' : label === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{label}</span>
}
