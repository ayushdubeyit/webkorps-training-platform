import { BookOpenCheck } from 'lucide-react'
import type { TrainingPresentationSummary } from '../types/dashboard.types'

export function TrainingOverview({ summary }: { summary: TrainingPresentationSummary }) {
  const publishedShare = summary.totalPrograms > 0
    ? (summary.publishedPrograms / summary.totalPrograms) * 100
    : 0

  return (
    <section aria-labelledby="training-overview-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Training overview</p>
          <h2 id="training-overview-heading" className="mt-1 text-2xl font-semibold text-slate-950">
            {summary.totalPrograms} <span className="text-base font-medium text-slate-600">programs</span>
          </h2>
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand-primary">
          <BookOpenCheck aria-hidden="true" size={19} />
        </span>
      </div>
      <div className="mt-5" role="img" aria-label={`${summary.publishedPrograms} published and ${summary.draftPrograms} draft training programs`}>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-primary" style={{ width: `${publishedShare}%` }} />
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-slate-500">Published</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900">{summary.publishedPrograms}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Draft</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900">{summary.draftPrograms}</dd>
        </div>
      </dl>
    </section>
  )
}
