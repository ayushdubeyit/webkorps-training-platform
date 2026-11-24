import { useMemo, useState } from 'react'
import { TrainingModuleGrid } from '../components/TrainingModuleGrid'
import { TrainingSearch } from '../components/TrainingSearch'
import { trainingDomainPresentationData } from '../fixtures/trainingPresentationData'
import { useTrainingPresentation } from '../../../training/hooks/useTrainingPresentation'

export function TrainingModulesPage() {
  const [search, setSearch] = useState('')
  const { documents, tools } = useTrainingPresentation()
  const filteredModules = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    if (!query) return trainingDomainPresentationData
    return trainingDomainPresentationData.filter((domain) => domain.name.toLocaleLowerCase().includes(query))
  }, [search])

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-semibold text-brand-primary">Employee workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Training modules</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Browse technology learning modules and their reference documents.</p>
      </header>
      <p role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">
        Catalog preview: module and document information is presentation data. Fixture files are not attached.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TrainingSearch value={search} onChange={setSearch} />
        <p className="text-sm text-slate-500" aria-live="polite">{filteredModules.length} training domains</p>
      </div>
      <TrainingModuleGrid domains={filteredModules} documents={documents} tools={tools} />
    </div>
  )
}
