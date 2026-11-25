import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { ApprovalAction, ApprovalEmployee } from '../types/approval.types'

interface ApprovalConfirmationDialogProps {
  employee: ApprovalEmployee | null
  action: ApprovalAction | null
  onCancel: () => void
  onConfirm: () => void
}

export function ApprovalConfirmationDialog({ employee, action, onCancel, onConfirm }: ApprovalConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const actionLabel = action === 'approve' ? 'Approve' : 'Reject'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (employee && action && !dialog.open) dialog.showModal()
    if ((!employee || !action) && dialog.open) dialog.close()
  }, [employee, action])

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      aria-labelledby="approval-confirmation-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40"
    >
      {employee && action && (
        <div className="p-6 sm:p-7">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand-primary">
            <AlertTriangle aria-hidden="true" size={21} />
          </span>
          <h2 id="approval-confirmation-title" className="mt-5 text-xl font-semibold">{actionLabel} employee?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            You selected <span className="font-semibold text-slate-900">{employee.fullName}</span>. {action === 'approve' ? 'Approve this employee account?' : 'Reject this employee registration?'}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">This preview is not connected to the backend, so no account status will be changed.</p>
          <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-primary">
              Cancel
            </button>
            <button type="button" onClick={onConfirm} className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
              Confirm {actionLabel.toLowerCase()}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
