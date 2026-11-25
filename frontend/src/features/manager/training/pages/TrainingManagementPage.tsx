import { useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { CreateModuleDialog } from '../components/CreateModuleDialog'
import { managedModulePresentationData } from '../fixtures/trainingManagementPresentationData'
import type { ManagedTrainingModule, TrainingModuleDraft } from '../types/trainingManagement.types'
import type { TrainingManagementOutletContext } from '../hooks/useTrainingManagementContext'

export function TrainingManagementPage() {
  const [modules, setModules] = useState<ManagedTrainingModule[]>(managedModulePresentationData)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [expandedProjectToolsSubcategoryId, setExpandedProjectToolsSubcategoryId] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const isLibrary = location.pathname === '/manager/training'

  function createModule(draft: TrainingModuleDraft) {
    const slug = draft.name.toLocaleLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const module: ManagedTrainingModule = { ...draft, id: `local-${slug || 'module'}-${Date.now()}` }
    setModules((current) => [...current, module])
    setIsCreateOpen(false)
    navigate(`/manager/training/${module.id}`)
  }

  const outletContext: TrainingManagementOutletContext = {
    modules,
    expandedProjectToolsSubcategoryId,
    setExpandedProjectToolsSubcategoryId,
  }

  return (
    <div className="space-y-7">
      <ScrollRestoration />
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand-primary">Manager workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Training management</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Manage technology modules, Project Tools, documents, and demo video previews.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/employee/training" className="inline-flex w-fit items-center justify-center rounded-lg border border-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Preview Employee Training</Link>
          {isLibrary && <button type="button" onClick={() => setIsCreateOpen(true)} className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"><Plus aria-hidden="true" size={17} /> Create module</button>}
        </div>
      </header>

      <nav aria-label="Training management sections" className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <NavLink end to="/manager/training" className={({ isActive }) => `rounded-lg px-4 py-2 text-sm font-semibold ${isActive ? 'bg-brand-primary text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>Technology modules</NavLink>
        <NavLink to="/manager/training/project-tools" className={({ isActive }) => `rounded-lg px-4 py-2 text-sm font-semibold ${isActive ? 'bg-brand-primary text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>Project Tools</NavLink>
      </nav>

      <Outlet context={outletContext} />
      <CreateModuleDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={createModule} />
    </div>
  )
}
