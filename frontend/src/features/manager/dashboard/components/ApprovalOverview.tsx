import { ArrowRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ApprovalEmployee } from '../../approvals/types/approval.types'
import { ApprovalStatusBadge } from '../../approvals/components/ApprovalStatusBadge'

interface ApprovalOverviewProps {
  pendingEmployees: ApprovalEmployee[]
}

export function ApprovalOverview({ pendingEmployees }: ApprovalOverviewProps) {
  return (
    <section aria-labelledby="pending-approvals-heading" className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 aria-hidden="true" size={18} className="text-brand-primary" />
            <h2 id="pending-approvals-heading" className="font-semibold text-slate-900">Pending approvals</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">{pendingEmployees.length} employees awaiting review</p>
        </div>
        <Link to="/manager/approvals" className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary">
          View all <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
      {pendingEmployees.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {pendingEmployees.slice(0, 4).map((employee) => (
            <li key={employee.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{employee.fullName}</p>
                <p className="mt-0.5 text-sm text-slate-500">{employee.department}</p>
              </div>
              <ApprovalStatusBadge status={employee.accountStatus} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-8 text-sm text-slate-500 sm:px-6">No pending preview approvals.</p>
      )}
    </section>
  )
}
