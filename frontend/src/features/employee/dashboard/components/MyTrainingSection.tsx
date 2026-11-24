import { ArrowRight, BookOpenCheck } from 'lucide-react'
import type { EmployeeTrainingModule } from '../types/employeeDashboard.types'

interface MyTrainingSectionProps {
  modules: EmployeeTrainingModule[]
}

export function MyTrainingSection({ modules }: MyTrainingSectionProps) {
  return (
    <section aria-labelledby="my-training-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="my-training-heading" className="text-xl font-semibold text-slate-950">My training</h2>
          <p className="mt-1 text-sm text-slate-500">Presentation-only assigned learning modules</p>
        </div>
        <span className="hidden items-center gap-1 text-xs font-medium text-slate-500 sm:inline-flex">
          <BookOpenCheck aria-hidden="true" size={15} /> {modules.length} modules
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((module) => (
          <article key={module.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">{module.domain}</p>
                <h3 className="mt-1.5 font-semibold text-slate-900">{module.title}</h3>
              </div>
              <CompletionBadge status={module.completionStatus} />
            </div>
            <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600">{module.description}</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Progress</span>
                <span className="font-semibold text-slate-800">{module.progressPercent}%</span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label={`${module.title} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={module.progressPercent}
              >
                <div className="h-full rounded-full bg-brand-primary transition-[width]" style={{ width: `${module.progressPercent}%` }} />
              </div>
            </div>
            <div className="mt-auto pt-5">
              <button
                type="button"
                disabled
                aria-describedby={`${module.id}-unavailable`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed"
              >
                Continue learning <ArrowRight aria-hidden="true" size={16} />
              </button>
              <p id={`${module.id}-unavailable`} className="mt-2 text-center text-xs text-slate-500">Learning pages are not yet implemented.</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function CompletionBadge({ status }: { status: EmployeeTrainingModule['completionStatus'] }) {
  const label = {
    COMPLETED: 'Completed',
    IN_PROGRESS: 'In progress',
    NOT_STARTED: 'Not started',
  }[status]

  return <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-primary">{label}</span>
}
