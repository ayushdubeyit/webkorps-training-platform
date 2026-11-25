import { ArrowLeft, Folder, Wrench } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTrainingPresentation } from '../../../training/hooks/useTrainingPresentation'
import { PdfViewer } from '../components/PdfViewer'
import { ProjectToolResourceSection } from '../components/ProjectToolResourceSection'
import { ProjectToolsNavigation } from '../components/ProjectToolsNavigation'
import { LoadingState } from '../../../../components/ui/LoadingState'
import { useMinimumLoadingDuration } from '../../../../hooks/useMinimumLoadingDuration'

export function ProjectToolsPage() {
  const { subcategories, tools } = useTrainingPresentation()
  return <ProjectToolsNavigation subcategories={subcategories} tools={tools} />
}

export function ProjectToolDetailsPage() {
  const { subcategoryId, toolId, resourceId } = useParams()
  const location = useLocation()
  const { subcategories, tools, resources } = useTrainingPresentation()
  const subcategory = subcategories.find((item) => item.id === subcategoryId && item.domainId === 'project-tools')
  const tool = tools.find((item) => item.id === toolId && item.subcategoryId === subcategory?.id)
  const isOpening = useMinimumLoadingDuration(tool && !resourceId ? location.key : null, 2000)

  if (!subcategory || !tool) return <MissingTrainingItem label="Project Tool" backTo="/employee/training/project-tools" />

  const toolResources = resources.filter((resource) => resource.toolId === tool.id)
  if (resourceId) {
    const resource = toolResources.find((item) => item.id === resourceId)
    if (!resource) return <MissingTrainingItem label="Training resource" backTo={`/employee/training/project-tools/${subcategory.id}/${tool.id}`} />
    return <PdfViewer document={resource} moduleName={tool.name} moduleId={`project-tools/${subcategory.id}/${tool.id}`} />
  }
  if (isOpening) return <LoadingState message={`Opening ${tool.name}...`} />

  return (
    <div className="space-y-7">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/employee/training" className="hover:text-brand-primary hover:underline">Training domains</Link><span aria-hidden="true">/</span>
        <Link to="/employee/training/project-tools" className="hover:text-brand-primary hover:underline">Project Tools</Link><span aria-hidden="true">/</span>
        <Link to={`/employee/training/project-tools/${subcategory.id}`} className="hover:text-brand-primary hover:underline">{subcategory.name}</Link><span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-slate-800">{tool.name}</span>
      </nav>
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><Wrench aria-hidden="true" size={21} /></span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-brand-primary">{subcategory.name}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{tool.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{tool.description}</p>
      </header>
      <div role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">Project Tools learning resources. Local previews are available only in this browser session.</div>
      <ProjectToolResourceSection title="Documents" type="DOCUMENT" resources={toolResources.filter((resource) => resource.type === 'DOCUMENT')} subcategoryId={subcategory.id} toolId={tool.id} />
      <ProjectToolResourceSection title="Demo Videos" type="VIDEO" resources={toolResources.filter((resource) => resource.type === 'VIDEO')} subcategoryId={subcategory.id} toolId={tool.id} />
    </div>
  )
}

function MissingTrainingItem({ label, backTo }: { label: string; backTo: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 text-center">
      <Folder aria-hidden="true" size={24} className="mx-auto text-brand-primary" />
      <h1 className="mt-4 text-xl font-semibold text-slate-900">{label} not found</h1>
      <p className="mt-2 text-sm text-slate-600">This item is not available in the current presentation state.</p>
      <Link to={backTo} className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={16} /> Back</Link>
    </section>
  )
}
