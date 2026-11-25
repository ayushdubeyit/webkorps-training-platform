import { useTrainingPresentation } from '../../../training/hooks/useTrainingPresentation'
import { ManagedModuleTable } from '../components/ManagedModuleTable'
import { useTrainingManagementContext } from '../hooks/useTrainingManagementContext'

export function TrainingManagementLibraryPage() {
  const { modules } = useTrainingManagementContext()
  const { documents } = useTrainingPresentation()

  return (
    <div className="space-y-5">
      <div role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm leading-5 text-slate-700">
        Presentation mode: technology module and document changes stay in this tab's memory. Selected files create local browser previews only; no data is sent to a server.
      </div>
      <section className="space-y-4">
        <header>
          <h2 className="text-xl font-semibold text-slate-950">Technology modules</h2>
          <p className="mt-1 text-sm text-slate-600">Choose a module to manage its documents on a dedicated page.</p>
        </header>
        <ManagedModuleTable modules={modules} documentCount={(moduleId) => documents.filter((document) => document.moduleId === moduleId).length} />
      </section>
    </div>
  )
}
