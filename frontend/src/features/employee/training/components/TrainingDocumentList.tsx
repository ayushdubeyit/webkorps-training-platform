import { ExternalLink, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TrainingDocument } from '../types/training.types'
import { formatFileSize } from '../../../training/utils/formatFileSize'

export function TrainingDocumentList({ documents, moduleId }: { documents: TrainingDocument[]; moduleId: string }) {
  if (documents.length === 0) {
    return <p className="rounded-lg border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">No documents are listed for this module.</p>
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {documents.map((document) => (
        <li key={document.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-primary">
              <FileText aria-hidden="true" size={19} />
            </span>
            <div className="min-w-0">
              <h3 className="font-medium text-slate-900">{document.title}</h3>
              <p className="mt-0.5 text-sm text-slate-600">{document.description}</p>
              <p className="mt-1 break-all text-xs text-slate-500">
                {document.fileName} · {formatFileSize(document.fileSizeBytes)} · Version {document.version}
              </p>
              {!document.fileReference && <p className="mt-1 text-xs text-slate-500">File is not attached to this presentation record.</p>}
            </div>
          </div>
          {document.fileReference ? (
            <Link to={`/employee/training/${moduleId}/documents/${document.id}`} className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-primary sm:self-auto">
              Open document <ExternalLink aria-hidden="true" size={15} />
            </Link>
          ) : (
            <span className="self-start rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500 sm:self-auto">Preview unavailable</span>
          )}
        </li>
      ))}
    </ul>
  )
}
