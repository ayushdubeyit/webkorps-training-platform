import { ArrowLeft, BookOpen } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { TrainingDocumentList } from '../components/TrainingDocumentList'
import { PdfViewer } from '../components/PdfViewer'
import { trainingModulePresentationData } from '../fixtures/trainingPresentationData'
import { useTrainingPresentation } from '../../../training/hooks/useTrainingPresentation'
import { LoadingState } from '../../../../components/ui/LoadingState'
import { useMinimumLoadingDuration } from '../../../../hooks/useMinimumLoadingDuration'

export function TrainingModuleDetailsPage() {
  const { moduleId, documentId } = useParams()
  const location = useLocation()
  const { documents } = useTrainingPresentation()
  const module = trainingModulePresentationData.find((item) => item.id === moduleId)
  const isOpening = useMinimumLoadingDuration(module && !documentId ? location.key : null, 2000)

  if (!module) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Training module not found</h1>
        <p className="mt-2 text-sm text-slate-600">This module is not available in the presentation catalog.</p>
        <Link to="/employee/training" className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline"><ArrowLeft size={16} aria-hidden="true" /> Back to modules</Link>
      </section>
    )
  }

  const moduleDocuments = documents.filter((document) => document.moduleId === module.id)
  if (documentId) {
    return <PdfViewer document={moduleDocuments.find((document) => document.id === documentId)} moduleName={module.name} moduleId={module.id} />
  }
  if (isOpening) return <LoadingState message={`Opening ${module.name}...`} />

  return (
    <div className="space-y-7">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/employee/training" className="inline-flex items-center gap-1.5 hover:text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={15} /> Training Library</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-slate-800">{module.name}</span>
      </nav>
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><BookOpen aria-hidden="true" size={21} /></span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-brand-primary">{module.category}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{module.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{module.description}</p>
      </header>
      <section aria-labelledby="module-documents-title" className="space-y-4">
        <div>
          <h2 id="module-documents-title" className="text-xl font-semibold text-slate-950">Training documents</h2>
          <p className="mt-1 text-sm text-slate-500">{moduleDocuments.length} {moduleDocuments.length === 1 ? 'document' : 'documents'} listed</p>
        </div>
        <TrainingDocumentList documents={moduleDocuments} moduleId={module.id} />
      </section>
    </div>
  )
}
