import { Bell, BookOpenCheck, ChartNoAxesColumnIncreasing, ClipboardList, ListTodo } from 'lucide-react'
import { Link } from 'react-router-dom'

const destinations = [
  { label: 'My training', icon: BookOpenCheck },
  { label: 'My assignments', icon: ClipboardList },
  { label: 'My progress', icon: ChartNoAxesColumnIncreasing },
  { label: 'My tasks', icon: ListTodo, to: '/employee/my-tasks' },
  { label: 'Notifications', icon: Bell },
]

export function EmployeeQuickNavigation() {
  return (
    <section aria-labelledby="employee-navigation-heading">
      <h2 id="employee-navigation-heading" className="font-semibold text-slate-900">Workspace</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {destinations.map(({ label, icon: Icon, to }) => (
          <article key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-primary">
              <Icon aria-hidden="true" size={18} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium text-slate-800">{label}</h3>
              {to ? <Link to={to} className="mt-0.5 inline-block text-xs font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary">View tasks</Link> : <p className="mt-0.5 text-xs text-slate-500">Not yet implemented</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
