import { BookOpen, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ManagedTrainingModule } from '../types/trainingManagement.types'

interface ManagedModuleTableProps {
  modules: ManagedTrainingModule[]
  documentCount: (moduleId: string) => number
}

export function ManagedModuleTable({ modules, documentCount }: ManagedModuleTableProps) {
  return (
    <section aria-labelledby="managed-modules-heading" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 id="managed-modules-heading" className="font-semibold text-slate-900">Technology modules</h2>
        <p className="mt-1 text-sm text-slate-500">{modules.length} modules in this presentation</p>
      </header>
      {modules.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500">No modules yet. Create a module to get started.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {modules.map((module) => (
            <li key={module.id}>
              <Link to={`/manager/training/${module.id}`} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-primary">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-primary"><BookOpen aria-hidden="true" size={18} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{module.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">{module.category} · {documentCount(module.id)} documents</span>
                </span>
                <ChevronRight aria-hidden="true" size={17} className="shrink-0 text-slate-400" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
