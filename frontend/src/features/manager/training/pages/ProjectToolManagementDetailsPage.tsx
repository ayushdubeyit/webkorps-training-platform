import { useState } from 'react'
import { ArrowLeft, FileText, Film, Plus, Wrench } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTrainingPresentation } from '../../../training/hooks/useTrainingPresentation'
import { trainingDomainPresentationData } from '../../../training/fixtures/trainingLibraryPresentationData'
import type { TrainingResource, TrainingResourceFileDraft, TrainingResourceType } from '../../../training/types/training.types'
import { ProjectToolsConfirmationDialog } from '../components/ProjectToolsConfirmationDialog'
import { ProjectToolsResourceTable } from '../components/ProjectToolsResourceTable'
import { TrainingDocumentDetails } from '../components/TrainingDocumentDetails'
import { TrainingResourceUploadDialog } from '../components/TrainingResourceUploadDialog'

export function ProjectToolManagementDetailsPage() {
  const { subcategoryId, toolId } = useParams()
  const { subcategories, tools, resources, addResource, replaceResource, removeResource } = useTrainingPresentation()
  const subcategory = subcategories.find((item) => item.id === subcategoryId && item.domainId === 'project-tools')
  const tool = tools.find((item) => item.id === toolId && item.subcategoryId === subcategory?.id)
  const [resourceType, setResourceType] = useState<TrainingResourceType>('DOCUMENT')
  const [replacement, setReplacement] = useState<TrainingResource | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<TrainingResource | null>(null)
  const [removingResource, setRemovingResource] = useState<TrainingResource | null>(null)
  const [notice, setNotice] = useState('')
  const toolResources = tool ? resources.filter((resource) => resource.toolId === tool.id) : []
  const domain = trainingDomainPresentationData.find((item) => item.id === 'project-tools')

  function openUpload(type: TrainingResourceType, resource: TrainingResource | null = null) {
    setResourceType(type)
    setReplacement(resource)
    setIsUploadOpen(true)
  }

  function saveResource(draft: TrainingResourceFileDraft, replacesId?: string) {
    if (!tool || !domain) return 'Choose a valid Project Tool before adding a resource.'
    const error = replacesId ? replaceResource(replacesId, draft) : addResource(tool.id, draft)
    if (error) return error
    setNotice(`${draft.type === 'VIDEO' ? 'Demo video' : 'Document'} is ready in this tab's local preview and is available in employee training.`)
    setReplacement(null)
    return null
  }

  function confirmRemove() {
    if (!removingResource) return
    removeResource(removingResource.id)
    if (selectedResource?.id === removingResource.id) setSelectedResource(null)
    setNotice(`${removingResource.title} was removed from the local preview.`)
    setRemovingResource(null)
  }

  if (!subcategory || !tool) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Project Tool not found</h2>
        <p className="mt-2 text-sm text-slate-600">This tool is not available in the current manager session.</p>
        <Link to="/manager/training/project-tools" className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={16} /> Back to Project Tools</Link>
      </section>
    )
  }

  const documents = toolResources.filter((resource) => resource.type === 'DOCUMENT')
  const videos = toolResources.filter((resource) => resource.type === 'VIDEO')
  const onView = (resource: TrainingResource) => setSelectedResource(resource)
  const onReplace = (resource: TrainingResource) => openUpload(resource.type, resource)

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/manager/training" className="hover:text-brand-primary hover:underline">Training Management</Link><span aria-hidden="true">/</span>
        <Link to="/manager/training/project-tools" state={{ expandedProjectToolsSubcategoryId: subcategory.id }} className="inline-flex items-center gap-1.5 hover:text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={15} /> Project Tools</Link><span aria-hidden="true">/</span>
        <span>{subcategory.name}</span><span aria-hidden="true">/</span><span aria-current="page" className="font-medium text-slate-800">{tool.name}</span>
      </nav>
      <header className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:p-6">
        <div className="min-w-0"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-primary"><Wrench aria-hidden="true" size={15} />{subcategory.name}</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">{tool.name}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{tool.description}</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => openUpload('DOCUMENT')} className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand-primary"><Plus aria-hidden="true" size={16} /> Add document</button>{domain?.supportsVideo && <button type="button" onClick={() => openUpload('VIDEO')} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-brand-primary"><Plus aria-hidden="true" size={16} /> Add demo video</button>}</div>
      </header>
      <div role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">Files are local previews for this tab's session; no server upload or permanent storage occurs.</div>
      {notice && <p role="status" aria-live="polite" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{notice}</p>}
      <ResourceSection title="Documents" type="DOCUMENT" icon={<FileText aria-hidden="true" size={18} />} resources={documents} onView={onView} onReplace={onReplace} onRemove={setRemovingResource} />
      <ResourceSection title="Demo Videos" type="VIDEO" icon={<Film aria-hidden="true" size={18} />} resources={videos} onView={onView} onReplace={onReplace} onRemove={setRemovingResource} />
      <TrainingResourceUploadDialog open={isUploadOpen} domain={domain!} type={resourceType} replacement={replacement} onClose={() => { setIsUploadOpen(false); setReplacement(null) }} onSave={saveResource} />
      <TrainingDocumentDetails document={selectedResource} onClose={() => setSelectedResource(null)} />
      <ProjectToolsConfirmationDialog open={Boolean(removingResource)} title={removingResource ? `Remove ${removingResource.title}?` : ''} description="This removes the resource from the local presentation state and releases its local preview URL. No server data is changed." onClose={() => setRemovingResource(null)} onConfirm={confirmRemove} />
    </div>
  )
}

function ResourceSection({ title, type, icon, resources, onView, onReplace, onRemove }: {
  title: string
  type: TrainingResourceType
  icon: React.ReactNode
  resources: TrainingResource[]
  onView: (resource: TrainingResource) => void
  onReplace: (resource: TrainingResource) => void
  onRemove: (resource: TrainingResource) => void
}) {
  return (
    <section aria-labelledby={`manager-${type.toLowerCase()}-heading`} className="space-y-3">
      <header className="flex items-center justify-between"><h3 id={`manager-${type.toLowerCase()}-heading`} className="flex items-center gap-2 text-xl font-semibold text-slate-950">{icon}{title}</h3><span className="text-sm text-slate-500">{resources.length} {resources.length === 1 ? 'resource' : 'resources'}</span></header>
      <ProjectToolsResourceTable resources={resources} emptyMessage={`No ${type === 'VIDEO' ? 'demo videos' : 'documents'} for this tool yet.`} onView={onView} onReplace={onReplace} onRemove={onRemove} />
    </section>
  )
}
