import { ExternalLink, Eye, FileText, RefreshCw, Trash2 } from 'lucide-react'
import type { ManagedTrainingDocument } from '../types/trainingManagement.types'
import { formatFileSize } from '../../../training/utils/formatFileSize'

interface TrainingDocumentTableProps {
  documents: ManagedTrainingDocument[]
  onView: (document: ManagedTrainingDocument) => void
  onReplace: (document: ManagedTrainingDocument) => void
  onRemove: (document: ManagedTrainingDocument) => void
}

export function TrainingDocumentTable({ documents, onView, onReplace, onRemove }: TrainingDocumentTableProps) {
  if (documents.length === 0) {
    return <p className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">No documents in this module yet.</p>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[660px] text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3">Document</th>
              <th scope="col" className="px-4 py-3">File</th>
              <th scope="col" className="px-4 py-3">Version</th>
              <th scope="col" className="px-4 py-3">Availability</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-900"><FileText aria-hidden="true" size={16} className="shrink-0 text-brand-primary" />{document.title}</span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{document.fileName}<span className="mt-0.5 block text-slate-400">{formatFileSize(document.fileSizeBytes)}</span></td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{document.version}</td>
                <td className="px-4 py-3.5">
                  {document.fileReference
                    ? <span className="text-xs font-medium text-brand-primary">Local preview ready</span>
                    : <span className="text-xs text-slate-500">Metadata only</span>}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => onView(document)} aria-label={`View details for ${document.title}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><Eye aria-hidden="true" size={16} /></button>
                    {document.fileReference && <a href={document.fileReference} target="_blank" rel="noreferrer" aria-label={`Open local document preview for ${document.title}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><ExternalLink aria-hidden="true" size={16} /></a>}
                    <button type="button" onClick={() => onReplace(document)} aria-label={`Replace ${document.title}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><RefreshCw aria-hidden="true" size={16} /></button>
                    <button type="button" onClick={() => onRemove(document)} aria-label={`Remove ${document.title} from preview`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><Trash2 aria-hidden="true" size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
