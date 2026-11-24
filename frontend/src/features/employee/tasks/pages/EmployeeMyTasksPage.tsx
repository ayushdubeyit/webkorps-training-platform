import { ArrowLeft, CalendarDays, ExternalLink, ListTodo } from 'lucide-react'
import { Link } from 'react-router-dom'
import { employeePresentationIdentity } from '../../../tasks/employeePresentationIdentity'
import { TaskStatusBadge } from '../../../tasks/components/TaskStatusBadge'
import { TaskTimingBadge } from '../../../tasks/components/TaskTimingBadge'
import { useTaskAssignments } from '../../../tasks/hooks/useTaskAssignments'
import { formatTaskDate } from '../../../tasks/utils/taskDates'

export function EmployeeMyTasksPage() {
  const { tasks, updateTaskStatus } = useTaskAssignments()
  const employeeId = employeePresentationIdentity?.id
  const myTasks = employeeId ? tasks.filter((task) => task.employeeId === employeeId) : []
  const employeeName = employeePresentationIdentity?.fullName ?? 'the selected demo employee'

  return <div className="space-y-7">
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500"><Link to="/employee" className="hover:text-brand-dark-blue hover:underline">Employee workspace</Link><span aria-hidden="true">/</span><span aria-current="page" className="font-medium text-slate-800">My Tasks</span></nav>
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand-primary">Employee workspace · Presentation preview</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">My Tasks</h1><p className="mt-2 text-sm leading-6 text-slate-600">Assignments for {employeeName}.</p></div><span className="w-fit rounded-full border border-brand-secondary/40 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-dark-blue">Demo employee · not signed in</span></header>
    <p role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm leading-6 text-slate-700">Tasks are shared in memory with the Manager preview in this application tab. A browser refresh may clear them; task changes are not sent to a backend.</p>
    {myTasks.length ? <ul className="space-y-4">{myTasks.map((task) => <li key={task.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><article aria-labelledby={`${task.id}-title`}>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="min-w-0"><h2 id={`${task.id}-title`} className="text-lg font-semibold text-slate-900">{task.title}</h2><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{task.description}</p></div><div className="flex flex-wrap gap-2"><TaskStatusBadge status={task.status} /><TaskTimingBadge startDate={task.startDate} deadline={task.deadline} status={task.status} /></div></div>
      <div className="mt-5 grid gap-x-6 gap-y-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2"><TaskDatum label="Assigned by" value={task.assignedBy} /><TaskDatum label="Start date" value={formatTaskDate(task.startDate)} /><TaskDatum label="Deadline" value={formatTaskDate(task.deadline)} /><TaskDatum label="Assigned date" value={formatTaskDate(task.assignedAt)} /></div>
      <section className="mt-5" aria-labelledby={`${task.id}-instructions`}><h3 id={`${task.id}-instructions`} className="text-sm font-semibold text-slate-800">Task pointers / instructions</h3><p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">{task.instructions}</p></section>
      {task.referenceUrl && <a href={task.referenceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline">Open reference <ExternalLink aria-hidden="true" size={14} /></a>}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4"><span className="mr-auto text-xs text-slate-500">Update your progress</span>{task.status === 'ASSIGNED' && <button type="button" onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')} className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Mark in progress</button>}{task.status === 'IN_PROGRESS' && <button type="button" onClick={() => updateTaskStatus(task.id, 'COMPLETED')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><ListTodo aria-hidden="true" size={16} />Mark completed</button>}{task.status === 'COMPLETED' && <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><CalendarDays aria-hidden="true" size={16} />Task completed</span>}</div>
    </article></li>)}</ul> : <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><ListTodo aria-hidden="true" size={24} /></span><h2 className="mt-4 text-lg font-semibold text-slate-900">No tasks assigned yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">When a manager assigns a task to this demo employee, it will appear here.</p><Link to="/employee" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={15} />Back to dashboard</Link></section>}
  </div>
}

function TaskDatum({ label, value }: { label: string; value: string }) {
  return <p><span className="block text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span><span className="mt-1 inline-flex items-center gap-1.5 font-medium text-slate-800"><CalendarDays aria-hidden="true" size={14} className="text-slate-400" />{value}</span></p>
}
