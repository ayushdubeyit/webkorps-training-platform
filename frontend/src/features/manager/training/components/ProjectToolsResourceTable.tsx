import { ExternalLink, Eye, FileText, Film, RefreshCw, Trash2 } from 'lucide-react'
import type { TrainingResource } from '../../../training/types/training.types'
import { formatFileSize } from '../../../training/utils/formatFileSize'

interface ProjectToolsResourceTableProps {
  resources: TrainingResource[]
  onView: (resource: TrainingResource) => void
  onReplace: (resource: TrainingResource) => void
  onRemove: (resource: TrainingResource) => void
  emptyMessage?: string
}

export function ProjectToolsResourceTable({ resources, onView, onReplace, onRemove, emptyMessage = 'No resources in this tool yet.' }: ProjectToolsResourceTableProps) {
  if (!resources.length) return <p className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">{emptyMessage}</p>
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-4 py-3">Resource</th><th scope="col" className="px-4 py-3">File information</th><th scope="col" className="px-4 py-3">Type</th><th scope="col" className="px-4 py-3">Availability</th><th scope="col" className="px-4 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td className="px-4 py-3.5"><span className="flex items-center gap-2 text-sm font-medium text-slate-900">{resource.type === 'VIDEO' ? <Film aria-hidden="true" size={16} className="text-brand-primary" /> : <FileText aria-hidden="true" size={16} className="text-brand-primary" />}{resource.title}</span></td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{resource.fileName}<span className="mt-0.5 block text-slate-400">{formatFileSize(resource.fileSizeBytes)}</span></td>
                <td className="px-4 py-3.5"><span className="rounded-full bg-brand-soft px-2 py-1 text-[10px] font-semibold text-brand-primary">{resource.type}</span></td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{resource.fileReference ? 'Local preview' : 'Metadata only'}</td>
                <td className="px-4 py-3.5"><div className="flex items-center gap-1">
                  <button type="button" onClick={() => onView(resource)} aria-label={`View details for ${resource.title}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><Eye aria-hidden="true" size={16} /></button>
                  {resource.fileReference && <a href={resource.fileReference} target="_blank" rel="noreferrer" aria-label={`Open local preview for ${resource.title}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><ExternalLink aria-hidden="true" size={16} /></a>}
                  <button type="button" onClick={() => onReplace(resource)} aria-label={`Replace ${resource.title}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><RefreshCw aria-hidden="true" size={16} /></button>
                  <button type="button" onClick={() => onRemove(resource)} aria-label={`Remove ${resource.title}`} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"><Trash2 aria-hidden="true" size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
