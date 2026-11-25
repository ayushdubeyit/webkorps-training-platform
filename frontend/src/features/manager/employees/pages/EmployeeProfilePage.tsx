import { ArrowLeft, BriefcaseBusiness, CalendarDays, ClipboardList, Mail, UserRound, type LucideIcon } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { employeeDirectoryPresentationData } from '../fixtures/employeeDirectoryPresentationData'
import { useTaskAssignments } from '../../../tasks/hooks/useTaskAssignments'
import { TaskStatusBadge } from '../../../tasks/components/TaskStatusBadge'
import { TaskTimingBadge } from '../../../tasks/components/TaskTimingBadge'
import { formatTaskDate } from '../../../tasks/utils/taskDates'

export function EmployeeProfilePage() {
  const { employeeId } = useParams()
  const location = useLocation()
  const { tasks } = useTaskAssignments()
  const employee = employeeDirectoryPresentationData.find((record) => record.id === employeeId)
  const employeeTasks = tasks.filter((task) => task.employeeId === employeeId)
  const taskAssigned = (location.state as { taskAssigned?: boolean } | null)?.taskAssigned

  if (!employee) {
    return <div className="mx-auto max-w-4xl space-y-5"><Link to="/manager/employees" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark-blue hover:underline"><ArrowLeft aria-hidden="true" size={16} /> Back to All Employees</Link><section className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center"><h1 className="text-xl font-semibold text-slate-900">Employee profile unavailable</h1><p className="mt-2 text-sm text-slate-600">This profile does not exist in the available approved preview entries.</p></section></div>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/manager/profile" className="hover:text-brand-dark-blue hover:underline">Manager Portal</Link><span aria-hidden="true">/</span><Link to="/manager/employees" className="hover:text-brand-dark-blue hover:underline">All Employees</Link><span aria-hidden="true">/</span><span className="font-medium text-slate-800" aria-current="page">{employee.fullName}</span>
      </nav>

      {taskAssigned && <p role="status" aria-live="polite" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Task added to this browser session and assigned to {employee.fullName}.</p>}

      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-7">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-primary"><UserRound aria-hidden="true" size={25} /></span>
          <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark-blue">Employee profile · Preview data</p><h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-950">{employee.fullName}</h1><p className="mt-1 truncate text-sm text-slate-500">{employee.email}</p></div>
        </div>
        <Link to="/manager/employees" className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"><ArrowLeft aria-hidden="true" size={16} /> Back to All Employees</Link>
      </header>

      <p role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm leading-6 text-slate-700">This is a fictional employee preview record sourced from the existing approval fixture. Fields missing from that record are marked as not provided.</p>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-5" aria-labelledby="employee-information-heading">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand-primary">Employee information</p><h2 id="employee-information-heading" className="mt-1 text-lg font-semibold text-slate-900">Personal information</h2></div>
            <dl className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
              <ProfileField label="Full name" value={employee.fullName} icon={UserRound} />
              <ProfileField label="Official email" value={employee.email} icon={Mail} />
              <ProfileField label="Employee ID" value={employee.employeeCode || null} icon={ClipboardList} />
              <ProfileField label="Role" value={employee.role.toLocaleLowerCase()} icon={BriefcaseBusiness} />
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand-primary">Employment information</p><h2 className="mt-1 text-lg font-semibold text-slate-900">Position and status</h2></div>
            <dl className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
              <ProfileField label="Designation" value={employee.designation ?? null} icon={BriefcaseBusiness} />
              <ProfileField label="Department" value={employee.department || null} icon={BriefcaseBusiness} />
              <ProfileField label="Joining date" value={employee.joiningDate ? formatDate(employee.joiningDate) : null} icon={CalendarDays} />
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Account status</dt><dd className="mt-1.5"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"><span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />Approved</span></dd></div>
            </dl>
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="assign-tasks-heading">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><ClipboardList aria-hidden="true" size={20} /></span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.13em] text-brand-primary">Employee actions</p>
          <h2 id="assign-tasks-heading" className="mt-1 text-lg font-semibold text-slate-900">Assign Tasks</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Create a local preview assignment for this approved employee.</p>
          <Link to={`/manager/employees/${employee.id}/assign-task`} className="mt-5 inline-flex w-full justify-center rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Assign a task</Link>
          <p className="mt-2 text-xs leading-5 text-slate-500">Local frontend preview only. No backend assignment is created.</p>
        </aside>
      </div>

      <section aria-labelledby="assigned-tasks-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand-primary">Employee task progress</p><h2 id="assigned-tasks-heading" className="mt-1 text-lg font-semibold text-slate-900">Assigned tasks</h2></div><span className="text-sm text-slate-500">{employeeTasks.length} {employeeTasks.length === 1 ? 'task' : 'tasks'}</span></div>
        {employeeTasks.length ? <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left"><thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-4 py-3">Task</th><th scope="col" className="px-4 py-3">Start date</th><th scope="col" className="px-4 py-3">Deadline</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3">Assigned date</th></tr></thead><tbody className="divide-y divide-slate-100">{employeeTasks.map((task) => <tr key={task.id}><th scope="row" className="px-4 py-3.5 text-sm font-semibold text-slate-800">{task.title}<span className="mt-1 block text-xs font-normal text-slate-500">{task.description}</span></th><td className="px-4 py-3.5 text-sm text-slate-600"><time dateTime={task.startDate}>{formatTaskDate(task.startDate)}</time></td><td className="px-4 py-3.5"><div className="space-y-1"><time className="block text-sm text-slate-600" dateTime={task.deadline}>{formatTaskDate(task.deadline)}</time><TaskTimingBadge startDate={task.startDate} deadline={task.deadline} status={task.status} /></div></td><td className="px-4 py-3.5"><TaskStatusBadge status={task.status} /></td><td className="px-4 py-3.5 text-sm text-slate-600"><time dateTime={task.assignedAt}>{formatTaskDate(task.assignedAt)}</time></td></tr>)}</tbody></table></div> : <p className="mt-4 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-600">No tasks have been assigned to this employee yet.</p>}
        <p className="mt-3 text-xs text-slate-500">Task progress is shared in this browser tab’s in-memory preview state.</p>
      </section>
    </div>
  )
}

function ProfileField({ label, value, icon: Icon }: { label: string; value: string | null; icon: LucideIcon }) {
  return <div className="flex gap-3"><span className="mt-0.5 text-slate-400"><Icon aria-hidden="true" size={17} /></span><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-800">{value || <span className="italic font-normal text-slate-400">Not provided in this preview data</span>}</dd></div></div>
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}
