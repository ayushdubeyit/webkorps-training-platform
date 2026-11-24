import { useState } from 'react'
import { ChevronDown, FolderPlus, Pencil, Plus, Trash2, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTrainingPresentation } from '../../../training/hooks/useTrainingPresentation'
import { ProjectToolsConfirmationDialog } from './ProjectToolsConfirmationDialog'
import { ProjectToolsManagementDialog, type ProjectToolsManagementMode } from './ProjectToolsManagementDialog'
import { useTrainingManagementContext } from '../hooks/useTrainingManagementContext'

type RemovalTarget = { kind: 'subcategory' | 'tool'; id: string; name: string }

export function ProjectToolsManagementPanel() {
  const { subcategories, tools, addSubcategory, updateSubcategory, removeSubcategory, addTool, updateTool, removeTool } = useTrainingPresentation()
  const { expandedProjectToolsSubcategoryId, setExpandedProjectToolsSubcategoryId } = useTrainingManagementContext()
  const [dialogMode, setDialogMode] = useState<ProjectToolsManagementMode | null>(null)
  const [dialogTargetId, setDialogTargetId] = useState<string | null>(null)
  const [dialogSubcategoryId, setDialogSubcategoryId] = useState<string | null>(null)
  const [removalTarget, setRemovalTarget] = useState<RemovalTarget | null>(null)
  const [notice, setNotice] = useState('')

  function openForm(mode: ProjectToolsManagementMode, targetId: string | null = null, subcategoryId: string | null = null) {
    setDialogMode(mode)
    setDialogTargetId(targetId)
    setDialogSubcategoryId(subcategoryId)
  }

  function saveFolderOrTool(name: string, description: string) {
    if (dialogMode === 'create-subcategory') {
      const item = addSubcategory(name, description)
      setExpandedProjectToolsSubcategoryId(item.id)
      setNotice(`${name} was added to this tab's Project Tools preview.`)
    } else if (dialogMode === 'edit-subcategory' && dialogTargetId) {
      updateSubcategory(dialogTargetId, name, description)
      setNotice(`${name} was updated in the Project Tools preview.`)
    } else if (dialogMode === 'create-tool' && dialogSubcategoryId) {
      addTool(dialogSubcategoryId, name, description)
      setExpandedProjectToolsSubcategoryId(dialogSubcategoryId)
      setNotice(`${name} was added to the Project Tools preview.`)
    } else if (dialogMode === 'edit-tool' && dialogTargetId) {
      updateTool(dialogTargetId, name, description)
      setNotice(`${name} was updated in the Project Tools preview.`)
    }
    closeForm()
  }

  function closeForm() {
    setDialogMode(null)
    setDialogTargetId(null)
    setDialogSubcategoryId(null)
  }

  function confirmRemoval() {
    if (!removalTarget) return
    if (removalTarget.kind === 'subcategory') {
      removeSubcategory(removalTarget.id)
      if (expandedProjectToolsSubcategoryId === removalTarget.id) setExpandedProjectToolsSubcategoryId(null)
      setNotice(`${removalTarget.name} and its contents were removed from the local preview.`)
    } else {
      removeTool(removalTarget.id)
      setNotice(`${removalTarget.name} and its resources were removed from the local preview.`)
    }
    setRemovalTarget(null)
  }

  const initialValues = dialogTargetId
    ? [...subcategories, ...tools].find((item) => item.id === dialogTargetId) ?? { name: '', description: '' }
    : { name: '', description: '' }

  return (
    <div className="space-y-5">
      <div role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">Project Tools is the only domain that supports demo videos. Changes remain in this tab's presentation state.</div>
      {notice && <p role="status" aria-live="polite" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{notice}</p>}
      <section aria-labelledby="manager-project-tools-heading" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div><h2 id="manager-project-tools-heading" className="font-semibold text-slate-950">Subcategories</h2><p className="mt-1 text-sm text-slate-500">{subcategories.length} folders · select a folder to expand its tools</p></div>
          <button type="button" onClick={() => openForm('create-subcategory')} className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand-primary px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand-primary"><FolderPlus aria-hidden="true" size={16} /> Add subcategory</button>
        </header>
        {subcategories.length ? (
          <div className="divide-y divide-slate-100">
            {subcategories.map((subcategory) => {
              const expanded = expandedProjectToolsSubcategoryId === subcategory.id
              const panelId = `manager-tools-${subcategory.id}`
              const subcategoryTools = tools.filter((tool) => tool.subcategoryId === subcategory.id)
              return (
                <section key={subcategory.id} className="px-3 sm:px-5">
                  <div className="flex items-center gap-1 py-2">
                    <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpandedProjectToolsSubcategoryId(expanded ? null : subcategory.id)} className="group flex min-w-0 flex-1 items-center justify-between gap-4 rounded-lg px-2 py-3 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-primary">
                      <span className="min-w-0"><span className="block font-semibold text-slate-950 group-hover:text-brand-primary">{subcategory.name}</span><span className="mt-1 block text-sm text-slate-600">{subcategory.description}</span></span>
                      <span className="flex shrink-0 items-center gap-3 text-xs text-slate-500">{subcategoryTools.length} tools<ChevronDown aria-hidden="true" size={18} className={`text-brand-primary transition-transform duration-300 ease-in-out motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`} /></span>
                    </button>
                    <button type="button" aria-label={`Rename ${subcategory.name}`} onClick={() => openForm('edit-subcategory', subcategory.id)} className="rounded-md p-2 text-slate-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand-primary"><Pencil aria-hidden="true" size={15} /></button>
                    <button type="button" aria-label={`Remove ${subcategory.name}`} onClick={() => setRemovalTarget({ kind: 'subcategory', id: subcategory.id, name: subcategory.name })} className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-600"><Trash2 aria-hidden="true" size={15} /></button>
                  </div>
                  <div id={panelId} role="region" aria-label={`${subcategory.name} tools`} aria-hidden={!expanded} inert={!expanded} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="min-h-0 overflow-hidden"><div className="space-y-3 border-t border-slate-100 py-4 pl-2 sm:pl-4">
                      {subcategoryTools.length ? <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">{subcategoryTools.map((tool) => <li key={tool.id} className="flex items-center gap-1 p-2"><Link to={`/manager/training/project-tools/${subcategory.id}/${tool.id}`} className="group flex min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-brand-soft/50 focus-visible:outline-2 focus-visible:outline-brand-primary" state={{ expandedProjectToolsSubcategoryId: subcategory.id }}><Wrench aria-hidden="true" size={17} className="shrink-0 text-brand-primary" /><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900 group-hover:text-brand-primary">{tool.name}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{tool.description}</span></span></Link><button type="button" aria-label={`Edit ${tool.name}`} onClick={() => openForm('edit-tool', tool.id)} className="rounded-md p-2 text-slate-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand-primary"><Pencil aria-hidden="true" size={15} /></button><button type="button" aria-label={`Remove ${tool.name}`} onClick={() => setRemovalTarget({ kind: 'tool', id: tool.id, name: tool.name })} className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-600"><Trash2 aria-hidden="true" size={15} /></button></li>)}</ul> : <p className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-center text-sm text-slate-500">No tools in this subcategory yet.</p>}
                      <button type="button" onClick={() => openForm('create-tool', null, subcategory.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary px-3 py-2 text-xs font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand-primary"><Plus aria-hidden="true" size={15} /> Add tool to {subcategory.name}</button>
                    </div></div>
                  </div>
                </section>
              )
            })}
          </div>
        ) : <p className="px-5 py-10 text-center text-sm text-slate-500">No subcategories yet. Add one to organize tools.</p>}
      </section>
      <ProjectToolsManagementDialog open={Boolean(dialogMode)} mode={dialogMode} initialName={initialValues.name} initialDescription={initialValues.description} onClose={closeForm} onSave={saveFolderOrTool} />
      <ProjectToolsConfirmationDialog open={Boolean(removalTarget)} title={removalTarget ? `Remove ${removalTarget.name}?` : ''} description={removalTarget ? 'This removes the item and its contents from the local presentation state. No server data is changed.' : ''} onClose={() => setRemovalTarget(null)} onConfirm={confirmRemoval} />
    </div>
  )
}
