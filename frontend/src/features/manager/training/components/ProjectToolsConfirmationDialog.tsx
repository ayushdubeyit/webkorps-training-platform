import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ProjectToolsConfirmationDialogProps {
  open: boolean
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
}

export function ProjectToolsConfirmationDialog(props: ProjectToolsConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (props.open && !dialog.open) dialog.showModal()
    if (!props.open && dialog.open) dialog.close()
  }, [props.open])

  return (
    <dialog ref={dialogRef} onClose={props.onClose} aria-labelledby="project-tools-confirm-title" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
      {props.open && <div className="p-6"><span className="flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand-primary"><AlertTriangle aria-hidden="true" size={20} /></span><h2 id="project-tools-confirm-title" className="mt-4 text-lg font-semibold">{props.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{props.description}</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => dialogRef.current?.close()} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" onClick={props.onConfirm} className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90">Confirm removal</button></div></div>}
    </dialog>
  )
}
