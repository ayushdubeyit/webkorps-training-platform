import { useEffect, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'

export type ProjectToolsManagementMode = 'create-subcategory' | 'edit-subcategory' | 'create-tool' | 'edit-tool'

interface ProjectToolsManagementDialogProps {
  open: boolean
  mode: ProjectToolsManagementMode | null
  initialName: string
  initialDescription: string
  onClose: () => void
  onSave: (name: string, description: string) => void
}

export function ProjectToolsManagementDialog(props: ProjectToolsManagementDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (props.open && !dialog.open) dialog.showModal()
    if (!props.open && dialog.open) dialog.close()
  }, [props.open])

  return (
    <dialog ref={dialogRef} onClose={props.onClose} aria-labelledby="project-tool-form-title" className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
      {props.open && props.mode && <ProjectToolsManagementForm key={`${props.mode}-${props.initialName}`} {...props} mode={props.mode} onClose={() => dialogRef.current?.close()} />}
    </dialog>
  )
}

function ProjectToolsManagementForm({ mode, initialName, initialDescription, onClose, onSave }: ProjectToolsManagementDialogProps & { mode: ProjectToolsManagementMode }) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [error, setError] = useState('')
  const isSubcategory = mode.endsWith('subcategory') || mode.includes('subcategory')
  const isEdit = mode.startsWith('edit')
  const label = isSubcategory ? 'subcategory' : 'tool'
  const title = `${isEdit ? 'Edit' : 'Create'} ${label}`

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !description.trim()) {
      setError('Enter a name and description.')
      return
    }
    onSave(name.trim(), description.trim())
    onClose()
  }

  return (
    <form onSubmit={submit} className="space-y-5 p-6 sm:p-7">
      <header className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Project Tools</p><h2 id="project-tool-form-title" className="mt-1 text-xl font-semibold">{title}</h2></div><button type="button" onClick={onClose} aria-label={`Close ${label} dialog`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><X aria-hidden="true" size={19} /></button></header>
      <div className="space-y-1.5"><label htmlFor="project-tools-name" className="block text-sm font-medium text-slate-700">{isSubcategory ? 'Subcategory name' : 'Tool name'}</label><input id="project-tools-name" autoFocus required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" /></div>
      <div className="space-y-1.5"><label htmlFor="project-tools-description" className="block text-sm font-medium text-slate-700">Description</label><textarea id="project-tools-description" required rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" /></div>
      {error && <p role="alert" className="text-sm text-slate-700">{error}</p>}
      <p className="text-xs text-slate-500">Changes apply to this browser session's presentation state only.</p>
      <footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90">{isEdit ? 'Save preview changes' : 'Add to preview'}</button></footer>
    </form>
  )
}
