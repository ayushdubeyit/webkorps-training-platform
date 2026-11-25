import { useState } from 'react'
import { ArrowLeft, BookOpen, FileUp } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTrainingPresentation } from '../../../training/hooks/useTrainingPresentation'
import { trainingDomainPresentationData } from '../../../training/fixtures/trainingLibraryPresentationData'
import { isTrainingResourceTypeAllowed } from '../../../training/utils/trainingResourcePolicy'
import type { ManagedTrainingDocument, TrainingDocumentDraft } from '../types/trainingManagement.types'
import { TrainingDocumentDetails } from '../components/TrainingDocumentDetails'
import { TrainingDocumentTable } from '../components/TrainingDocumentTable'
import { UploadTrainingPdfDialog } from '../components/UploadTrainingPdfDialog'
import { useTrainingManagementContext } from '../hooks/useTrainingManagementContext'

export function TrainingModuleManagementPage() {
  const { moduleId } = useParams()
  const { modules } = useTrainingManagementContext()
  const { documents, addDocument, replaceDocument, removeDocument } = useTrainingPresentation()
  const module = modules.find((item) => item.id === moduleId)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [replacement, setReplacement] = useState<ManagedTrainingDocument | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<ManagedTrainingDocument | null>(null)
  const [notice, setNotice] = useState('')
  const moduleDocuments = module ? documents.filter((document) => document.moduleId === module.id) : []

  if (!module) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Training module not found</h2>
        <p className="mt-2 text-sm text-slate-600">This module is not available in the current manager session.</p>
        <Link to="/manager/training" className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={16} /> Back to Training Management</Link>
      </section>
    )
  }
  const selectedModule = module

  function saveDocument(draft: TrainingDocumentDraft, replacesDocumentId?: string) {
    const domain = trainingDomainPresentationData.find((item) => item.id === selectedModule.id)
    if (!domain || !isTrainingResourceTypeAllowed(domain, 'DOCUMENT')) return 'Document upload is not allowed for this training domain.'
    const error = replacesDocumentId ? replaceDocument(replacesDocumentId, draft) : addDocument(selectedModule.id, draft)
    if (error) return error
    setNotice(`${draft.file.name} is ready in this tab's local preview. No server upload or permanent replacement occurred.`)
    setReplacement(null)
    return null
  }

  function removeModuleDocument(document: ManagedTrainingDocument) {
    removeDocument(document.id)
    if (selectedDocument?.id === document.id) setSelectedDocument(null)
    setNotice(`${document.title} was removed from this tab's local preview.`)
  }

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/manager/training" className="inline-flex items-center gap-1.5 hover:text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={15} /> Training Management</Link>
        <span aria-hidden="true">/</span><span aria-current="page" className="font-medium text-slate-800">{module.name}</span>
      </nav>
      <header className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:p-6">
        <div className="min-w-0"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-primary"><BookOpen aria-hidden="true" size={15} />{module.category}</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">{module.name}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{module.description}</p></div>
        <button type="button" onClick={() => { setReplacement(null); setIsUploadOpen(true) }} className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"><FileUp aria-hidden="true" size={16} /> Add document</button>
      </header>
      <div role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">Documents and replacements are available as local previews in this tab only.</div>
      {notice && <p role="status" aria-live="polite" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{notice}</p>}
      <section aria-labelledby="managed-module-documents" className="space-y-4">
        <header><h3 id="managed-module-documents" className="text-xl font-semibold text-slate-950">Documents</h3><p className="mt-1 text-sm text-slate-500">{moduleDocuments.length} {moduleDocuments.length === 1 ? 'document' : 'documents'}</p></header>
        <TrainingDocumentTable documents={moduleDocuments} onView={setSelectedDocument} onReplace={(document) => { setReplacement(document); setIsUploadOpen(true) }} onRemove={removeModuleDocument} />
        {moduleDocuments.length > 0 && moduleDocuments.every((document) => !document.fileReference) && <p className="px-1 text-xs text-slate-500">Fixture rows contain metadata only; no files are attached.</p>}
      </section>
      <UploadTrainingPdfDialog open={isUploadOpen} replacement={replacement} onClose={() => { setIsUploadOpen(false); setReplacement(null) }} onSave={saveDocument} />
      <TrainingDocumentDetails document={selectedDocument} onClose={() => setSelectedDocument(null)} />
    </div>
  )
}
