import { Search } from 'lucide-react'
import type { AccountStatus } from '../../../../types'
import type { ApprovalStatusFilter } from '../types/approval.types'

interface ApprovalFiltersProps {
  search: string
  status: ApprovalStatusFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: ApprovalStatusFilter) => void
}

export function ApprovalFilters({ search, status, onSearchChange, onStatusChange }: ApprovalFiltersProps) {
  return (
    <section aria-label="Filter employees" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
      <label className="relative block">
        <span className="sr-only">Search employees</span>
        <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, email, code, or department"
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>
      <label className="block">
        <span className="sr-only">Filter by account status</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as ApprovalStatusFilter)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        >
          <option value="ALL">All account statuses</option>
          {(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'] satisfies AccountStatus[]).map((accountStatus) => (
            <option key={accountStatus} value={accountStatus}>
              {accountStatus.charAt(0) + accountStatus.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}
