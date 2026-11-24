import { ArrowRight, CircleCheck, CircleDashed } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TaskAssignment } from '../../../tasks/types/taskAssignment.types'
import { TaskStatusBadge } from '../../../tasks/components/TaskStatusBadge'
import { TaskTimingBadge } from '../../../tasks/components/TaskTimingBadge'
import { formatTaskDate } from '../../../tasks/utils/taskDates'

export function MyTasksSection({ tasks }: { tasks: TaskAssignment[] }) {
  const visibleTasks = tasks.slice(0, 3)
  return <section aria-labelledby="my-tasks-heading" className="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 id="my-tasks-heading" className="font-semibold text-slate-900">My tasks</h2><p className="mt-1 text-sm text-slate-500">Tasks assigned to your presentation profile</p></div><Link to="/employee/my-tasks" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary">View all tasks <ArrowRight aria-hidden="true" size={14} /></Link></div>
    {visibleTasks.length ? <ul className="divide-y divide-slate-100">{visibleTasks.map((task) => <li key={task.id} className="flex gap-3 px-5 py-4 sm:px-6"><TaskIcon status={task.status} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="text-sm font-medium text-slate-900">{task.title}</h3><div className="flex flex-wrap gap-1.5"><TaskStatusBadge status={task.status} /><TaskTimingBadge startDate={task.startDate} deadline={task.deadline} status={task.status} /></div></div><p className="mt-1 text-sm leading-5 text-slate-600">{task.description}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span>Due <time dateTime={task.deadline}>{formatTaskDate(task.deadline)}</time></span><span>Assigned by {task.assignedBy}</span></div></div></li>)}</ul> : <p className="px-5 py-8 text-center text-sm text-slate-600 sm:px-6">No tasks have been assigned to you yet. Your manager’s assignments will appear here.</p>}
    <p className="border-t border-slate-100 px-5 py-3 text-center text-xs text-slate-500 sm:px-6">Assignments are local to this browser session preview.</p>
  </section>
}

function TaskIcon({ status }: { status: TaskAssignment['status'] }) {
  return status === 'COMPLETED' ? <CircleCheck aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-emerald-600" /> : <CircleDashed aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-brand-secondary" />
}
