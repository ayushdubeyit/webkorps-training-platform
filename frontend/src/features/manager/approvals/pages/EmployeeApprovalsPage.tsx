import { useMemo, useState } from 'react'
import { ApprovalConfirmationDialog } from '../components/ApprovalConfirmationDialog'
import { ApprovalFilters } from '../components/ApprovalFilters'
import { ApprovalStats } from '../components/ApprovalStats'
import { ApprovalTable } from '../components/ApprovalTable'
import { EmployeeDetailsPanel } from '../components/EmployeeDetailsPanel'
import { approvalPresentationData } from '../fixtures/approvalPresentationData'
import type {
  ApprovalAction,
  ApprovalEmployee,
  ApprovalStatusFilter,
} from '../types/approval.types'

export function EmployeeApprovalsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ApprovalStatusFilter>('ALL')
  const [selectedEmployee, setSelectedEmployee] = useState<ApprovalEmployee | null>(null)
  const [confirmation, setConfirmation] = useState<{
    employee: ApprovalEmployee
    action: ApprovalAction
  } | null>(null)
  const [notice, setNotice] = useState('')

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()
    return approvalPresentationData.filter((employee) => {
      const matchesStatus = status === 'ALL' || employee.accountStatus === status
      const matchesSearch = !normalizedSearch || [
        employee.fullName,
        employee.email,
        employee.employeeCode,
        employee.department,
      ].some((value) => value.toLocaleLowerCase().includes(normalizedSearch))
      return matchesStatus && matchesSearch
    })
  }, [search, status])

  function openConfirmation(employee: ApprovalEmployee, action: ApprovalAction) {
    setNotice('')
    setConfirmation({ employee, action })
  }

  function confirmAction() {
    if (!confirmation) return
    setConfirmation(null)
    setNotice(`Backend integration is not connected. ${confirmation.employee.fullName}'s account status was not changed.`)
  }

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-semibold text-brand-primary">Manager workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Employee Approvals</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Review employee account requests and their current approval status.
        </p>
      </header>

      <p role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">
        Presentation preview: all employee records below are fictional sample data.
      </p>

      {notice && <p role="status" aria-live="polite" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800">{notice}</p>}

      <ApprovalStats employees={approvalPresentationData} />

      <section className="space-y-4" aria-label="Employee records">
        <ApprovalFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />
        <p className="text-xs text-slate-500" aria-live="polite">
          Showing {filteredEmployees.length} of {approvalPresentationData.length} preview employees
        </p>
        <ApprovalTable
          employees={filteredEmployees}
          onSelect={setSelectedEmployee}
          onAction={openConfirmation}
        />
      </section>

      <EmployeeDetailsPanel employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      <ApprovalConfirmationDialog
        employee={confirmation?.employee ?? null}
        action={confirmation?.action ?? null}
        onCancel={() => setConfirmation(null)}
        onConfirm={confirmAction}
      />
    </div>
  )
}
