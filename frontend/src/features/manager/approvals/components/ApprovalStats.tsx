import { Check, Clock3, UserRoundX } from 'lucide-react'
import type { ApprovalEmployee } from '../types/approval.types'

interface ApprovalStatsProps {
  employees: ApprovalEmployee[]
}

export function ApprovalStats({ employees }: ApprovalStatsProps) {
  const stats = [
    { label: 'Pending employees', status: 'PENDING', icon: Clock3 },
    { label: 'Approved employees', status: 'APPROVED', icon: Check },
    { label: 'Rejected employees', status: 'REJECTED', icon: UserRoundX },
  ] as const

  return (
    <section aria-label="Employee approval summary" className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ label, status, icon: Icon }) => {
        const count = employees.filter((employee) => employee.accountStatus === status).length
        return (
          <article key={status} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">{label}</p>
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand-primary">
                <Icon aria-hidden="true" size={18} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{count}</p>
          </article>
        )
      })}
    </section>
  )
}
