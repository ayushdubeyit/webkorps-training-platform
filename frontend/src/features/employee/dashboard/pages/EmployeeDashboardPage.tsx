import { BookOpenCheck, CircleCheck, ListTodo, PlayCircle } from 'lucide-react'
import { ManagerSummaryCard } from '../../../manager/dashboard/components/ManagerSummaryCard'
import { RecentActivity } from '../../../manager/dashboard/components/RecentActivity'
import { activityPresentationData, employeePresentationName, trainingModulePresentationData } from '../fixtures/employeeDashboardPresentationData'
import { EmployeeQuickNavigation } from '../components/EmployeeQuickNavigation'
import { LearningProgressSection } from '../components/LearningProgressSection'
import { MyTasksSection } from '../components/MyTasksSection'
import { MyTrainingSection } from '../components/MyTrainingSection'
import { useTaskAssignments } from '../../../tasks/hooks/useTaskAssignments'
import { employeePresentationIdentity } from '../../../tasks/employeePresentationIdentity'

export function EmployeeDashboardPage() {
  const { tasks } = useTaskAssignments()
  const now = new Date()
  const currentDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(now)
  const dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const trainingCounts = {
    assigned: trainingModulePresentationData.length,
    completed: trainingModulePresentationData.filter((module) => module.completionStatus === 'COMPLETED').length,
    inProgress: trainingModulePresentationData.filter((module) => module.completionStatus === 'IN_PROGRESS').length,
  }
  const employeeTasks = tasks.filter((task) => task.employeeId === employeePresentationIdentity?.id)
  const pendingTaskCount = employeeTasks.filter((task) => task.status !== 'COMPLETED').length

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand-primary">Employee workspace · Presentation preview</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Welcome, {employeePresentationName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Your learning overview, current tasks, and progress at a glance.
          </p>
          <p className="mt-3 text-sm text-slate-500"><time dateTime={dateTime}>{currentDate}</time></p>
        </div>
        <span className="w-fit rounded-full border border-brand-secondary/40 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-primary">
          Sample employee · not signed in
        </span>
      </header>

      <p role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">
        Dashboard preview: training and activity details are presentation samples. Task assignments are shared in-memory preview state for this browser tab.
      </p>

      <section aria-label="Presentation sample summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerSummaryCard label="Assigned training" value={trainingCounts.assigned} icon={BookOpenCheck} description="Fictional preview modules" />
        <ManagerSummaryCard label="Completed modules" value={trainingCounts.completed} icon={CircleCheck} description="Calculated from preview modules" />
        <ManagerSummaryCard label="In-progress modules" value={trainingCounts.inProgress} icon={PlayCircle} description="Calculated from preview modules" />
        <ManagerSummaryCard label="Open tasks" value={pendingTaskCount} icon={ListTodo} description="Shared assignments not yet completed" />
      </section>

      <MyTrainingSection modules={trainingModulePresentationData} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <MyTasksSection tasks={employeeTasks} />
        <LearningProgressSection modules={trainingModulePresentationData} />
      </div>

      <RecentActivity events={activityPresentationData} />
      <EmployeeQuickNavigation />
    </div>
  )
}
