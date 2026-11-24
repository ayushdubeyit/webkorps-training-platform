import type { TrainingDocument, TrainingDomain, TrainingTool } from '../types/training.types'
import { TrainingModuleCard } from './TrainingModuleCard'

interface TrainingModuleGridProps {
  domains: TrainingDomain[]
  documents: TrainingDocument[]
  tools: TrainingTool[]
}

export function TrainingModuleGrid({ domains, documents, tools }: TrainingModuleGridProps) {
  if (domains.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <h2 className="font-semibold text-slate-900">No training modules found</h2>
        <p className="mt-1 text-sm text-slate-500">Try another search term.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {domains.map((domain) => {
        const isProjectTools = domain.id === 'project-tools'
        const itemCount = isProjectTools
          ? tools.length
          : documents.filter((document) => document.moduleId === domain.id).length
        return (
          <TrainingModuleCard
            key={domain.id}
            domain={domain}
            itemCount={itemCount}
            itemLabel={isProjectTools ? 'tools' : itemCount === 1 ? 'document' : 'documents'}
          />
        )
      })}
    </div>
  )
}
