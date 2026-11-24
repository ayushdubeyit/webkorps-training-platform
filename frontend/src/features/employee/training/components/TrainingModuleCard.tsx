import { ArrowRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TrainingDomain } from '../types/training.types'

interface TrainingModuleCardProps {
  domain: TrainingDomain
  itemCount: number
  itemLabel: string
}

export function TrainingModuleCard({ domain, itemCount, itemLabel }: TrainingModuleCardProps) {
  const href = domain.id === 'project-tools' ? '/employee/training/project-tools' : `/employee/training/${domain.id}`
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-secondary/70 hover:shadow-md">
      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
        <FileText aria-hidden="true" size={21} />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-brand-primary">{domain.id === 'project-tools' ? 'Tools & applications' : 'Technology training'}</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-950">{domain.name}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{domain.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">{itemCount} {itemLabel}</span>
        <Link to={href} className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary">
          {domain.id === 'project-tools' ? 'Explore tools' : 'View module'} <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </article>
  )
}
