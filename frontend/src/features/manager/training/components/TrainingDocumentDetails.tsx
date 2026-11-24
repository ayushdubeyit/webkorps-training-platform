import { useEffect, useRef } from 'react'
import { ExternalLink, X } from 'lucide-react'
import type { ManagedTrainingDocument } from '../types/trainingManagement.types'
import { formatFileSize } from '../../../training/utils/formatFileSize'
import type { TrainingResource } from '../../../training/types/training.types'

interface TrainingDocumentDetailsProps {
  document: ManagedTrainingDocument | TrainingResource | null
  onClose: () => void
}

export function TrainingDocumentDetails({ document, onClose }: TrainingDocumentDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (document && !dialog.open) dialog.showModal()
    if (!document && dialog.open) dialog.close()
  }, [document])

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="training-document-details-title" className="fixed inset-y-0 right-0 m-0 ml-auto h-dvh max-h-none w-full max-w-md border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
      {document && (
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">{'type' in document ? `${document.type.toLocaleLowerCase()} details` : 'Document details'}</p><h2 id="training-document-details-title" className="mt-1 text-xl font-semibold">{document.title}</h2></div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close document details" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><X aria-hidden="true" size={20} /></button>
          </header>
          <dl className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <Detail label="Description" value={document.description} />
            <Detail label="File name" value={document.fileName} />
            <Detail label="File size" value={formatFileSize(document.fileSizeBytes)} />
            <Detail label="Version" value={document.version ?? 'Not provided'} />
            {document.uploadedAt && <Detail label="Uploaded at" value={document.uploadedAt} />}
            {'type' in document && <Detail label="Resource type" value={document.type} />}
            {'mimeType' in document && <Detail label="MIME type" value={document.mimeType} />}
            <Detail label="File availability" value={document.fileReference ? 'Local preview only; not uploaded to a server.' : 'Presentation metadata only; no file attached.'} />
          </dl>
          <footer className="space-y-2 border-t border-slate-200 px-6 py-4">
            {document.fileReference && <a href={document.fileReference} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90">Open local file preview <ExternalLink aria-hidden="true" size={15} /></a>}
            <button type="button" onClick={() => dialogRef.current?.close()} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-primary">Close details</button>
          </footer>
        </div>
      )}
    </dialog>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-900">{value}</dd></div>
}
