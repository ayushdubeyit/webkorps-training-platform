import { ChartNoAxesColumnIncreasing } from 'lucide-react'
import type { EmployeeTrainingModule } from '../types/employeeDashboard.types'

interface LearningProgressSectionProps {
  modules: EmployeeTrainingModule[]
}

export function LearningProgressSection({ modules }: LearningProgressSectionProps) {
  const moduleCount = modules.length
  const completedCount = modules.filter((module) => module.completionStatus === 'COMPLETED').length
  const inProgressCount = modules.filter((module) => module.completionStatus === 'IN_PROGRESS').length
  const remainingCount = modules.filter((module) => module.completionStatus === 'NOT_STARTED').length
  const overallPercent = moduleCount === 0
    ? 0
    : Math.round(modules.reduce((total, module) => total + module.progressPercent, 0) / moduleCount)

  return (
    <section aria-labelledby="learning-progress-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <ChartNoAxesColumnIncreasing aria-hidden="true" size={19} className="text-brand-primary" />
        <h2 id="learning-progress-heading" className="font-semibold text-slate-900">Learning progress</h2>
      </div>
      <p className="mt-5 text-sm text-slate-500">Overall completion</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-3xl font-semibold tracking-tight text-slate-950">{overallPercent}%</p>
        <p className="text-xs text-slate-500">average across {moduleCount} modules</p>
      </div>
      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="Overall learning completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={overallPercent}
      >
        <div className="h-full rounded-full bg-brand-primary" style={{ width: `${overallPercent}%` }} />
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-center">
        <ProgressCount label="Completed" count={completedCount} />
        <ProgressCount label="In progress" count={inProgressCount} />
        <ProgressCount label="Remaining" count={remainingCount} />
      </dl>
      <p className="mt-4 text-xs text-slate-500">Remaining counts modules not yet started.</p>
    </section>
  )
}

function ProgressCount({ label, count }: { label: string; count: number }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold text-slate-900">{count}</dd>
    </div>
  )
}
