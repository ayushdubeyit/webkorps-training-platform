import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { FileUp, X } from 'lucide-react'
import type { TrainingDomain, TrainingResource, TrainingResourceFileDraft, TrainingResourceType } from '../../../training/types/training.types'
import { formatFileSize } from '../../../training/utils/formatFileSize'
import { isTrainingResourceTypeAllowed, validateTrainingResourceFile } from '../../../training/utils/trainingResourcePolicy'
import { WebkorpsLoader } from '../../../../components/ui/WebkorpsLoader'
import { LoadingState } from '../../../../components/ui/LoadingState'
import { useMinimumLoadingDuration } from '../../../../hooks/useMinimumLoadingDuration'

interface TrainingResourceUploadDialogProps {
  open: boolean
  domain: TrainingDomain
  type: TrainingResourceType
  replacement: TrainingResource | null
  onClose: () => void
  onSave: (draft: TrainingResourceFileDraft, replacesResourceId?: string) => string | null
}

export function TrainingResourceUploadDialog(props: TrainingResourceUploadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (props.open && !dialog.open) dialog.showModal()
    if (!props.open && dialog.open) dialog.close()
  }, [props.open])

  return (
    <dialog ref={dialogRef} onClose={props.onClose} onCancel={(event) => { if (isProcessing) event.preventDefault() }} aria-labelledby="resource-upload-title" className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
      {props.open && <TrainingResourceUploadForm key={`${props.type}-${props.replacement?.id ?? 'new'}`} {...props} onClose={() => dialogRef.current?.close()} onProcessingChange={setIsProcessing} />}
    </dialog>
  )
}

function TrainingResourceUploadForm({ domain, type, replacement, onClose, onSave, onProcessingChange }: TrainingResourceUploadDialogProps & { onProcessingChange: (isProcessing: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState('')
  const [formError, setFormError] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [title, setTitle] = useState(replacement?.title ?? '')
  const [description, setDescription] = useState(replacement?.description ?? '')
  const [version, setVersion] = useState(replacement?.version ?? '1.0')
  const [processingKey, setProcessingKey] = useState<string | null>(null)
  const isProcessing = useMinimumLoadingDuration(processingKey, 3000)
  const processingComplete = processingKey !== null && !isProcessing

  useEffect(() => {
    if (!processingKey || isProcessing) return
    onProcessingChange(false)
  }, [isProcessing, onProcessingChange, processingKey])

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const selected = input.files?.[0] ?? null
    setFile(null)
    setPreviewUrl(null)
    setFileError('')
    if (!selected) return
    setIsChecking(true)
    const error = await validateTrainingResourceFile(domain, type, selected)
    setIsChecking(false)
    if (error) {
      setFileError(error)
      input.value = ''
      return
    }
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    if (isProcessing || processingComplete) return
    if (!isTrainingResourceTypeAllowed(domain, type)) {
      setFormError('This resource type is not allowed for the selected domain.')
      return
    }
    if (!file) {
      setFileError('Select a supported file before adding the resource.')
      return
    }
    if (!title.trim()) {
      setFormError('Enter a resource title.')
      return
    }
    onProcessingChange(true)
    try {
      const error = onSave({
        type,
        file,
        title: title.trim(),
        description: description.trim(),
        ...(type === 'DOCUMENT' ? { version: version.trim() || '1.0' } : {}),
      }, replacement?.id)
      if (error) {
        onProcessingChange(false)
        setFormError(error)
        return
      }
      setProcessingKey(`${Date.now()}-${Math.random()}`)
    } catch (cause) {
      onProcessingChange(false)
      setFormError(cause instanceof Error ? cause.message : 'The local resource preview could not be prepared.')
    }
  }

  const accepts = type === 'VIDEO'
    ? '.mp4,video/mp4'
    : '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const titleText = type === 'VIDEO' ? (replacement ? 'Replace demo video' : 'Add demo video') : (replacement ? 'Replace document' : 'Add document')

  return (
    <form onSubmit={submit} className="space-y-5 p-6 sm:p-7">
      <header className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Project Tools · {type}</p><h2 id="resource-upload-title" className="mt-1 text-xl font-semibold">{titleText}</h2></div>
        <button type="button" onClick={onClose} disabled={isProcessing} aria-label="Close resource upload dialog" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50"><X aria-hidden="true" size={19} /></button>
      </header>
      <div className="space-y-1.5">
        <label htmlFor="resource-file" className="block text-sm font-medium text-slate-700">Select {type === 'VIDEO' ? 'MP4 video' : 'PDF, DOC, or DOCX document'}</label>
        <input id="resource-file" type="file" disabled={isProcessing || processingComplete} accept={accepts} onChange={selectFile} aria-describedby={fileError ? 'resource-file-error' : undefined} className="block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-700 file:mr-3 file:border-0 file:bg-brand-soft file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary disabled:opacity-60" />
        {fileError && <p id="resource-file-error" role="alert" className="text-xs font-medium text-slate-700">{fileError}</p>}
        {isChecking && <div role="status" aria-live="polite" className="flex items-center gap-2 text-xs text-slate-600"><span aria-hidden="true"><WebkorpsLoader size={22} /></span><span>Checking file type and signature…</span></div>}
        {file && <p className="text-xs text-slate-600">Selected: <span className="font-medium">{file.name}</span> · {formatFileSize(file.size)}</p>}
      </div>
      {isProcessing && file && <LoadingState message={type === 'VIDEO' ? 'Preparing video preview...' : 'Preparing document preview...'} filename={file.name} size={42} className="min-h-0 rounded-lg bg-brand-soft px-4 py-3" />}
      {processingComplete && file && <p role="status" aria-live="polite" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-slate-700">{file.name} is ready in this tab's local Project Tools preview and is available in employee training.</p>}
      <TextField id="resource-title" label="Resource title" value={title} onChange={setTitle} required disabled={isProcessing || processingComplete} />
      <TextField id="resource-description" label="Description (optional)" value={description} onChange={setDescription} multiline disabled={isProcessing || processingComplete} />
      {type === 'DOCUMENT' && <TextField id="resource-version" label="Version (optional)" value={version} onChange={setVersion} disabled={isProcessing || processingComplete} />}
      {type === 'VIDEO' && previewUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Video preview</p>
          <video controls preload="metadata" src={previewUrl} className="max-h-64 w-full rounded-lg bg-black" aria-label="Selected demo video preview">Your browser does not support video playback.</video>
        </div>
      )}
      {file && (
        <div role="status" className="rounded-lg border border-brand-secondary/40 bg-brand-soft p-3">
          <div className="flex items-center justify-between gap-3 text-xs"><span className="font-medium text-slate-800">Local preview readiness</span><span className="font-semibold text-brand-primary">100%</span></div>
          <div role="progressbar" aria-label="Local resource preview readiness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full w-full rounded-full bg-brand-primary" /></div>
          <p className="mt-2 text-xs text-slate-600">This file will be available in this browser session only. No server upload was made.</p>
        </div>
      )}
      {formError && <p role="alert" className="text-sm font-medium text-slate-700">{formError}</p>}
      <footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} disabled={isProcessing} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">{processingComplete ? 'Done' : 'Cancel'}</button>
        {!processingComplete && <button type="submit" disabled={isChecking || isProcessing || !file} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 disabled:cursor-wait disabled:opacity-70"><FileUp aria-hidden="true" size={16} />{isChecking ? 'Checking file…' : replacement ? 'Replace in preview' : 'Add to preview'}</button>}
      </footer>
    </form>
  )
}

function TextField({ id, label, value, onChange, required = false, multiline = false, disabled = false }: { id: string; label: string; value: string; onChange: (value: string) => void; required?: boolean; multiline?: boolean; disabled?: boolean }) {
  const className = 'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
  return <div className="space-y-1.5"><label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>{multiline ? <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required} disabled={disabled} rows={3} className={className} /> : <input id={id} value={value} onChange={(event) => onChange(event.target.value)} required={required} disabled={disabled} className={className} />}</div>
}
