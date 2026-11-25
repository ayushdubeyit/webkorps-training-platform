import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { FileUp, X } from 'lucide-react'
import type { ManagedTrainingDocument, TrainingDocumentDraft } from '../types/trainingManagement.types'
import { formatFileSize } from '../../../training/utils/formatFileSize'
import { trainingDomainPresentationData } from '../../../training/fixtures/trainingLibraryPresentationData'
import { validateTrainingResourceFile } from '../../../training/utils/trainingResourcePolicy'
import { WebkorpsLoader } from '../../../../components/ui/WebkorpsLoader'
import { LoadingState } from '../../../../components/ui/LoadingState'
import { useMinimumLoadingDuration } from '../../../../hooks/useMinimumLoadingDuration'

interface UploadTrainingPdfDialogProps {
  open: boolean
  replacement: ManagedTrainingDocument | null
  onClose: () => void
  onSave: (draft: TrainingDocumentDraft, replacesDocumentId?: string) => string | null
}

export function UploadTrainingPdfDialog({ open, replacement, onClose, onSave }: UploadTrainingPdfDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={dialogRef} onClose={onClose} onCancel={(event) => { if (isProcessing) event.preventDefault() }} aria-labelledby="upload-pdf-title" className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
      {open && (
        <UploadPdfForm
          key={replacement?.id ?? 'new-pdf'}
          replacement={replacement}
          onClose={() => dialogRef.current?.close()}
          onSave={onSave}
          onProcessingChange={setIsProcessing}
        />
      )}
    </dialog>
  )
}

function UploadPdfForm({
  replacement,
  onClose,
  onSave,
  onProcessingChange,
}: {
  replacement: ManagedTrainingDocument | null
  onClose: () => void
  onSave: (draft: TrainingDocumentDraft, replacesDocumentId?: string) => string | null
  onProcessingChange: (isProcessing: boolean) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState(replacement?.title ?? '')
  const [description, setDescription] = useState(replacement?.description ?? '')
  const [version, setVersion] = useState(replacement ? `${replacement.version}.1` : '1.0')
  const [fileError, setFileError] = useState('')
  const [formError, setFormError] = useState('')
  const [isValidatingFile, setIsValidatingFile] = useState(false)
  const [processingKey, setProcessingKey] = useState<string | null>(null)
  const isProcessing = useMinimumLoadingDuration(processingKey, 3000)
  const processingComplete = processingKey !== null && !isProcessing

  useEffect(() => {
    if (!processingKey || isProcessing) return
    onProcessingChange(false)
  }, [isProcessing, onProcessingChange, processingKey])

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const selected = input.files?.[0] ?? null
    if (!selected) {
      setFile(null)
      setFileError('Select a PDF, DOC, or DOCX file to continue.')
      return
    }
    setIsValidatingFile(true)
    setFileError('')
    const error = await validateTrainingResourceFile(trainingDomainPresentationData.find((domain) => domain.id === 'java-developer')!, 'DOCUMENT', selected)
    if (error) {
      setFile(null)
      setFileError(error)
      input.value = ''
    } else {
      setFile(selected)
    }
    setIsValidatingFile(false)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    if (isProcessing || processingComplete) return
    if (!file) {
      setFileError('Select a valid PDF, DOC, or DOCX file.')
      return
    }
    if (!title.trim() || !description.trim() || !version.trim()) {
      setFormError('Complete the document title, description, and version.')
      return
    }
    onProcessingChange(true)
    try {
      const error = onSave({ file, title: title.trim(), description: description.trim(), version: version.trim() }, replacement?.id)
      if (error) {
        onProcessingChange(false)
        setFormError(error)
        return
      }
      setProcessingKey(`${Date.now()}-${Math.random()}`)
    } catch (cause) {
      onProcessingChange(false)
      setFormError(cause instanceof Error ? cause.message : 'The document preview could not be prepared.')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 p-6 sm:p-7">
      <header className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Local document preview</p><h2 id="upload-pdf-title" className="mt-1 text-xl font-semibold">{replacement ? 'Replace training document' : 'Add training document'}</h2></div>
        <button type="button" onClick={onClose} disabled={isProcessing} aria-label="Close document dialog" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50"><X aria-hidden="true" size={19} /></button>
      </header>
      <div className="space-y-1.5">
        <label htmlFor="training-pdf-file" className="block text-sm font-medium text-slate-700">Select PDF, DOC, or DOCX file</label>
        <input id="training-pdf-file" type="file" disabled={isProcessing || processingComplete} accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={selectFile} aria-describedby={fileError ? 'training-pdf-error' : undefined} className="block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-700 file:mr-3 file:border-0 file:bg-brand-soft file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary disabled:opacity-60" />
        {fileError && <p id="training-pdf-error" role="alert" className="text-xs font-medium text-slate-700">{fileError}</p>}
        {isValidatingFile && <div role="status" aria-live="polite" className="flex items-center gap-2 text-xs text-slate-600"><span aria-hidden="true"><WebkorpsLoader size={22} /></span><span>Checking file type and signature…</span></div>}
        {file && <p className="text-xs text-slate-600">Selected: <span className="font-medium">{file.name}</span> · {formatFileSize(file.size)}</p>}
      </div>
      {isProcessing && file && <LoadingState message="Preparing document preview..." filename={file.name} size={42} className="min-h-0 rounded-lg bg-brand-soft px-4 py-3" />}
      {processingComplete && file && <p role="status" aria-live="polite" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-slate-700">{file.name} is ready in this tab's local preview and is available in employee training.</p>}
      <TextField id="training-document-title" label="Document title" value={title} onChange={setTitle} required disabled={isProcessing || processingComplete} />
      <TextField id="training-document-description" label="Description" value={description} onChange={setDescription} required multiline disabled={isProcessing || processingComplete} />
      <TextField id="training-document-version" label="Version" value={version} onChange={setVersion} required disabled={isProcessing || processingComplete} />
      {file && (
        <div role="status" className="rounded-lg border border-brand-secondary/40 bg-brand-soft p-3">
          <div className="flex items-center justify-between gap-3 text-xs"><span className="font-medium text-slate-800">Local preview readiness</span><span className="font-semibold text-brand-primary">100%</span></div>
          <div role="progressbar" aria-label="Local document preview readiness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full w-full rounded-full bg-brand-primary" /></div>
          <p className="mt-2 text-xs text-slate-600">File is ready for this browser session. No server upload was made.</p>
        </div>
      )}
      {formError && <p role="alert" className="text-sm font-medium text-slate-700">{formError}</p>}
      <footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} disabled={isProcessing} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">{processingComplete ? 'Done' : 'Cancel'}</button>
          {!processingComplete && <button type="submit" disabled={isValidatingFile || isProcessing || !file} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-wait disabled:opacity-70"><FileUp aria-hidden="true" size={16} />{isValidatingFile ? 'Checking file…' : replacement ? 'Replace in preview' : 'Add to preview'}</button>}
      </footer>
    </form>
  )
}

function TextField({ id, label, value, onChange, required, multiline = false, disabled = false }: { id: string; label: string; value: string; onChange: (value: string) => void; required: boolean; multiline?: boolean; disabled?: boolean }) {
  const className = 'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      {multiline
        ? <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required} disabled={disabled} rows={3} className={className} />
        : <input id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required} disabled={disabled} className={className} />}
    </div>
  )
}
