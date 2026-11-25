import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { ApprovalEmployee } from '../types/approval.types'
import { ApprovalStatusBadge } from './ApprovalStatusBadge'

interface EmployeeDetailsPanelProps {
  employee: ApprovalEmployee | null
  onClose: () => void
}

export function EmployeeDetailsPanel({ employee, onClose }: EmployeeDetailsPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (employee && !dialog.open) dialog.showModal()
    if (!employee && dialog.open) dialog.close()
  }, [employee])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="employee-details-title"
      className="fixed inset-y-0 right-0 m-0 ml-auto h-dvh max-h-none w-full max-w-md border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40"
    >
      {employee && (
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Employee details</p>
              <h2 id="employee-details-title" className="mt-1 text-xl font-semibold">{employee.fullName}</h2>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close employee details" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary">
              <X aria-hidden="true" size={20} />
            </button>
          </header>
          <dl className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <Detail label="Full name" value={employee.fullName} />
            <Detail label="Official email" value={employee.email} />
            <Detail label="Employee code" value={employee.employeeCode} />
            <Detail label="Department" value={employee.department} />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Account status</dt>
              <dd className="mt-1.5"><ApprovalStatusBadge status={employee.accountStatus} /></dd>
            </div>
          </dl>
          <footer className="border-t border-slate-200 px-6 py-4">
            <button type="button" onClick={() => dialogRef.current?.close()} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-primary">
              Back to employee list
            </button>
          </footer>
        </div>
      )}
    </dialog>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-900">{value}</dd>
    </div>
  )
}
