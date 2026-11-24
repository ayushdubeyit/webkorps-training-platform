import { useEffect, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { TrainingModuleDraft } from '../types/trainingManagement.types'

interface CreateModuleDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (draft: TrainingModuleDraft) => void
}

const emptyDraft: TrainingModuleDraft = { name: '', description: '', category: '' }

export function CreateModuleDialog({ open, onClose, onCreate }: CreateModuleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [error, setError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function close() {
    setDraft(emptyDraft)
    setError('')
    dialogRef.current?.close()
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = draft.name.trim()
    const description = draft.description.trim()
    const category = draft.category.trim()
    if (!name || !description || !category) {
      setError('Complete all fields before adding the module.')
      return
    }
    onCreate({ name, description, category })
    close()
  }

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="create-module-title" className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
      <form onSubmit={submit} className="space-y-5 p-6 sm:p-7">
        <header className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Training library</p><h2 id="create-module-title" className="mt-1 text-xl font-semibold">Create technology module</h2></div>
          <button type="button" onClick={close} aria-label="Close create module dialog" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><X aria-hidden="true" size={19} /></button>
        </header>
        <TextField id="module-name" label="Module name" value={draft.name} onChange={(name) => setDraft((value) => ({ ...value, name }))} required />
        <TextField id="module-category" label="Technology / category" value={draft.category} onChange={(category) => setDraft((value) => ({ ...value, category }))} required />
        <TextField id="module-description" label="Description" value={draft.description} onChange={(description) => setDraft((value) => ({ ...value, description }))} required multiline />
        {error && <p role="alert" className="text-sm font-medium text-slate-700">{error}</p>}
        <p className="text-xs text-slate-500">The module will be added to this page's local presentation state only.</p>
        <footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={close} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Add to preview</button>
        </footer>
      </form>
    </dialog>
  )
}

function TextField({ id, label, value, onChange, required, multiline = false }: { id: string; label: string; value: string; onChange: (value: string) => void; required: boolean; multiline?: boolean }) {
  const className = 'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      {multiline
        ? <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required} rows={3} className={className} />
        : <input id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required} className={className} />}
    </div>
  )
}
