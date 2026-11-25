import type { AccountStatus } from '../../../../types'

const statusStyles: Record<AccountStatus, string> = {
  PENDING: 'bg-brand-soft text-brand-primary',
  APPROVED: 'bg-brand-secondary/20 text-slate-800',
  REJECTED: 'bg-slate-100 text-slate-700',
  SUSPENDED: 'bg-slate-200 text-slate-800',
}

export function ApprovalStatusBadge({ status }: { status: AccountStatus }) {
  const label = status.charAt(0) + status.slice(1).toLowerCase()

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {label}
    </span>
  )
}
