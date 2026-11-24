import type { LucideIcon } from 'lucide-react'

interface ManagerSummaryCardProps {
  label: string
  value: number
  icon: LucideIcon
  description: string
}

export function ManagerSummaryCard({ label, value, icon: Icon, description }: ManagerSummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value.toLocaleString()}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-primary">
          <Icon aria-hidden="true" size={19} />
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </article>
  )
}
