import { Download, ExternalLink, FileText, Film } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TrainingResource, TrainingResourceType } from '../types/training.types'
import { formatFileSize } from '../../../training/utils/formatFileSize'

export function ProjectToolResourceSection({
  title,
  type,
  resources,
  subcategoryId,
  toolId,
}: {
  title: string
  type: TrainingResourceType
  resources: TrainingResource[]
  subcategoryId: string
  toolId: string
}) {
  return (
    <section aria-labelledby={`${type.toLowerCase()}-resources-heading`} className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id={`${type.toLowerCase()}-resources-heading`} className="text-xl font-semibold text-slate-950">{title}</h2>
        <span className="text-sm text-slate-500">{resources.length} {resources.length === 1 ? 'resource' : 'resources'}</span>
      </div>
      {resources.length ? (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {resources.map((resource) => (
            <li key={resource.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
              <div className="flex min-w-0 gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-primary">
                  {type === 'VIDEO' ? <Film aria-hidden="true" size={19} /> : <FileText aria-hidden="true" size={19} />}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-medium text-slate-900">{resource.title}</h3><span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand-primary">{resource.type}</span></div>
                  {resource.description && <p className="mt-1 text-sm leading-5 text-slate-600">{resource.description}</p>}
                  <p className="mt-1 break-all text-xs text-slate-500">{resource.fileName} · {formatFileSize(resource.fileSizeBytes)}{resource.version ? ` · Version ${resource.version}` : ''}</p>
                  {!resource.fileReference && <p className="mt-1 text-xs text-slate-500">Presentation metadata only; no file is attached.</p>}
                  {resource.type === 'VIDEO' && resource.fileReference && (
                    <video controls preload="metadata" src={resource.fileReference} className="mt-4 max-h-80 w-full rounded-lg border border-slate-200 bg-black" aria-label={`${resource.title} demo video`}>
                      Your browser does not support video playback.
                    </video>
                  )}
                </div>
              </div>
              {resource.fileReference ? (
                type === 'VIDEO' ? (
                  <a href={resource.fileReference} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ExternalLink aria-hidden="true" size={15} /> Open video</a>
                ) : (
                  <Link to={`/employee/training/project-tools/${subcategoryId}/${toolId}/resources/${resource.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download aria-hidden="true" size={15} /> Open document</Link>
                )
              ) : (
                <span className="self-start rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">Preview unavailable</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">No {type === 'VIDEO' ? 'demo videos' : 'documents'} are available for this tool.</p>
      )}
    </section>
  )
}
