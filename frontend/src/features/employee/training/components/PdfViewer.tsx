import { AlertCircle, ArrowLeft, ExternalLink, FileText } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { TrainingDocument, TrainingResource } from '../types/training.types'
import { LoadingState } from '../../../../components/ui/LoadingState'
import { useMinimumLoadingDuration } from '../../../../hooks/useMinimumLoadingDuration'

interface PdfViewerProps {
  document: TrainingDocument | TrainingResource | undefined
  moduleName: string
  moduleId: string
}

export function PdfViewer({ document, moduleName, moduleId }: PdfViewerProps) {
  const location = useLocation()
  const isDocument = document && (!('type' in document) || document.type === 'DOCUMENT')
  const isOpening = useMinimumLoadingDuration(isDocument ? location.key : null, 1000)
  const backPath = `/employee/training/${moduleId}`
  const isVideo = document && 'type' in document && document.type === 'VIDEO'
  const canEmbedPdf = document?.fileName.toLocaleLowerCase().endsWith('.pdf')

  if (isOpening) return <LoadingState message="Opening document..." />

  return (
    <section className="space-y-5">
      <Link to={backPath} className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary">
        <ArrowLeft aria-hidden="true" size={17} /> Back to {moduleName}
      </Link>
      <header className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-primary"><FileText aria-hidden="true" size={19} /></span>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-950">{document?.title ?? 'Document viewer'}</h1>
            <p className="text-sm text-slate-500">{moduleName}</p>
          </div>
        </div>
        {document?.fileReference && (
          <a href={document.fileReference} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Open in new tab <ExternalLink aria-hidden="true" size={15} />
          </a>
        )}
      </header>
      {document?.fileReference && isVideo ? (
        <video controls autoPlay preload="metadata" src={document.fileReference} className="max-h-[70vh] w-full rounded-xl border border-slate-300 bg-black" aria-label={`${document.title} demo video`}>
          Your browser does not support video playback.
        </video>
      ) : document?.fileReference && canEmbedPdf ? (
        <iframe title={`${document.title} PDF`} src={document.fileReference} className="h-[70vh] min-h-[420px] w-full rounded-xl border border-slate-300 bg-white" />
      ) : document?.fileReference ? (
        <div role="status" className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-center">
          <FileText aria-hidden="true" size={28} className="text-brand-primary" />
          <h2 className="mt-4 font-semibold text-slate-900">Document ready to open</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">This {document.fileName.toLocaleLowerCase().endsWith('.docx') ? 'DOCX' : 'DOC'} file will open with the browser or an installed document handler.</p>
          <a href={document.fileReference} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white">Open document <ExternalLink aria-hidden="true" size={15} /></a>
        </div>
      ) : (
        <div role="status" className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center">
          <AlertCircle aria-hidden="true" size={28} className="text-brand-primary" />
          <h2 className="mt-4 font-semibold text-slate-900">File preview is unavailable</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            {document
              ? 'This presentation record includes document information, but no PDF file is attached.'
              : 'This document could not be found in the training library.'}
          </p>
        </div>
      )}
    </section>
  )
}
