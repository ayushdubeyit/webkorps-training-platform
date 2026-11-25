import { ChartNoAxesColumnIncreasing } from 'lucide-react'

export function EmployeeTrackerPage() {
  return <div className="mx-auto max-w-5xl space-y-7">
    <header><p className="text-sm font-semibold text-brand-primary">Employee workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Tracker</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">A place for future progress tracking.</p></header>
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><ChartNoAxesColumnIncreasing aria-hidden="true" size={24} /></span><h2 className="mt-4 text-lg font-semibold text-slate-900">Coming Soon</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Tracker features are not available yet.</p></section>
  </div>
}
