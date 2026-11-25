import { ArrowUpRight, BookOpen, ClipboardCheck, FileChartColumn, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const quickLinks = [
  { title: 'All Employees', detail: 'Browse approved employee profiles', icon: Users, to: '/manager/employees' },
  { title: 'Employee approvals', detail: 'Review registration requests', icon: ClipboardCheck, to: '/manager/approvals' },
  { title: 'Training modules', detail: 'Manage modules and resources', icon: BookOpen, to: '/manager/training' },
]

export function ManagerQuickNavigation() {
  return (
    <section aria-labelledby="quick-navigation-heading">
      <h2 id="quick-navigation-heading" className="font-semibold text-slate-900">Quick navigation</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map(({ title, detail, icon: Icon, to }) => <Link key={to} to={to} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-secondary focus-visible:outline-2 focus-visible:outline-brand-primary">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-primary"><Icon aria-hidden="true" size={19} /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-0.5 block text-xs text-slate-500">{detail}</span></span>
          <ArrowUpRight aria-hidden="true" size={16} className="text-slate-400 group-hover:text-brand-primary" />
        </Link>)}
        <article className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 opacity-80 shadow-sm">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><FileChartColumn aria-hidden="true" size={19} /></span>
          <span className="min-w-0"><span className="block text-sm font-semibold text-slate-800">Reports</span><span className="mt-0.5 block text-xs text-slate-500">Not yet implemented</span></span>
        </article>
      </div>
    </section>
  )
}
