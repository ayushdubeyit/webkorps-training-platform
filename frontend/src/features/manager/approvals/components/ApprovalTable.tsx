import { Check, Eye, X } from 'lucide-react'
import type { ApprovalAction, ApprovalEmployee } from '../types/approval.types'
import { ApprovalStatusBadge } from './ApprovalStatusBadge'
import { useManagerAccount } from '../../account/useManagerAccount'

interface ApprovalTableProps {
  employees: ApprovalEmployee[]
  onSelect: (employee: ApprovalEmployee) => void
  onAction: (employee: ApprovalEmployee, action: ApprovalAction) => void
}

export function ApprovalTable({ employees, onSelect, onAction }: ApprovalTableProps) {
  const { preferences } = useManagerAccount()
  const cellPadding = preferences.tableDensity === 'compact' ? 'px-4 py-2.5' : 'px-5 py-4'
  if (employees.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="font-medium text-slate-800">No employees match these filters</p>
        <p className="mt-1 text-sm text-slate-500">Try a different search term or account status.</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">Employee name</th>
                <th scope="col" className="px-5 py-3.5">Official email</th>
                <th scope="col" className="px-5 py-3.5">Employee code</th>
                <th scope="col" className="px-5 py-3.5">Department</th>
                <th scope="col" className="px-5 py-3.5">Account status</th>
                <th scope="col" className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((employee) => (
                <tr key={employee.id} className="align-middle">
                  <td className={cellPadding}>
                    <button type="button" onClick={() => onSelect(employee)} className="font-medium text-brand-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-brand-primary">
                      {employee.fullName}
                    </button>
                  </td>
                  <td className={`${cellPadding} text-sm text-slate-600`}>{employee.email}</td>
                  <td className={`${cellPadding} text-sm text-slate-600`}>{employee.employeeCode}</td>
                  <td className={`${cellPadding} text-sm text-slate-600`}>{employee.department}</td>
                  <td className={cellPadding}><ApprovalStatusBadge status={employee.accountStatus} /></td>
                  <td className={cellPadding}><ActionButtons employee={employee} onAction={onAction} onSelect={onSelect} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="grid gap-3 md:hidden">
        {employees.map((employee) => (
          <li key={employee.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <button type="button" onClick={() => onSelect(employee)} className="truncate text-left font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary">
                  {employee.fullName}
                </button>
                <p className="mt-1 break-all text-sm text-slate-600">{employee.email}</p>
              </div>
              <ApprovalStatusBadge status={employee.accountStatus} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-slate-500">Employee code</dt><dd className="mt-0.5 text-slate-800">{employee.employeeCode}</dd></div>
              <div><dt className="text-xs text-slate-500">Department</dt><dd className="mt-0.5 text-slate-800">{employee.department}</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <ActionButtons employee={employee} onAction={onAction} onSelect={onSelect} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function ActionButtons({
  employee,
  onAction,
  onSelect,
}: {
  employee: ApprovalEmployee
  onAction: (employee: ApprovalEmployee, action: ApprovalAction) => void
  onSelect: (employee: ApprovalEmployee) => void
}) {
  if (employee.accountStatus !== 'PENDING') {
    return (
      <button type="button" onClick={() => onSelect(employee)} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary">
        <Eye size={15} aria-hidden="true" /> View details
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button type="button" onClick={() => onAction(employee, 'approve')} className="inline-flex items-center gap-1 rounded-md bg-brand-primary px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
        <Check size={14} aria-hidden="true" /> Approve
      </button>
      <button type="button" onClick={() => onAction(employee, 'reject')} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
        <X size={14} aria-hidden="true" /> Reject
      </button>
      <button type="button" onClick={() => onSelect(employee)} className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary">
        <Eye size={15} aria-hidden="true" /> Details
      </button>
    </div>
  )
}
