import { Activity } from 'lucide-react'
import type { ActivityPresentationEvent } from '../types/dashboard.types'

export function RecentActivity({ events }: { events: ActivityPresentationEvent[] }) {
  return (
    <section aria-labelledby="recent-activity-heading" className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Activity aria-hidden="true" size={18} className="text-brand-primary" />
          <h2 id="recent-activity-heading" className="font-semibold text-slate-900">Recent activity</h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">Presentation-only sample events · not audit records</p>
      </div>
      <ol className="space-y-0 px-5 sm:px-6">
        {events.map((event, index) => (
          <li key={event.id} className="flex gap-3 py-4">
            <div className="flex flex-col items-center" aria-hidden="true">
              <span className="mt-1 size-2.5 rounded-full bg-brand-secondary" />
              {index < events.length - 1 && <span className="mt-1 w-px flex-1 bg-slate-200" />}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{event.title}</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{event.label}</span>
              </div>
              <p className="mt-1 text-sm leading-5 text-slate-500">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
