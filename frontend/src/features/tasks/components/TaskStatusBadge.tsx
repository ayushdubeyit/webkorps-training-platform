import type { AssignedTaskStatus } from '../types/taskAssignment.types'

const statusDetails: Record<AssignedTaskStatus, { label: string; className: string }> = {
  ASSIGNED: { label: 'Assigned', className: 'bg-slate-100 text-slate-700' },
  IN_PROGRESS: { label: 'In progress', className: 'bg-sky-100 text-sky-800' },
  COMPLETED: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800' },
}

export function TaskStatusBadge({ status }: { status: AssignedTaskStatus }) {
  const detail = statusDetails[status]
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${detail.className}`}>{detail.label}</span>
}
