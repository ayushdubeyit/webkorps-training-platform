import { useMemo } from 'react'
import { Users, UserCheck, UserRoundClock, BookOpenCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { approvalPresentationData } from '../../approvals/fixtures/approvalPresentationData'
import { ApprovalOverview } from '../components/ApprovalOverview'
import { ManagerQuickNavigation } from '../components/ManagerQuickNavigation'
import { ManagerSummaryCard } from '../components/ManagerSummaryCard'
import { RecentActivity } from '../components/RecentActivity'
import { TrainingOverview } from '../components/TrainingOverview'
import { activityPresentationEvents, managerDashboardMetrics } from '../fixtures/managerDashboardPresentationData'
import { trainingPresentationSummary } from '../fixtures/trainingPresentationData'

export function ManagerDashboardPage() {
  const pendingEmployees = useMemo(
    () => approvalPresentationData.filter((employee) => employee.accountStatus === 'PENDING'),
    [],
  )
  const now = new Date()
  const currentDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(now)
  const dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand-primary">Manager workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Welcome to your dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            A high-level view of employee learning and approvals.
          </p>
          <p className="mt-3 text-sm text-slate-500"><time dateTime={dateTime}>{currentDate}</time></p>
        </div>
        <Link to="/manager/approvals" className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
          Review approvals <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </header>

      <p role="note" className="rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm text-slate-700">
        Dashboard preview: statistics and activity below are presentation samples, not live platform data.
      </p>

      <section aria-label="Presentation sample statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerSummaryCard label="Total employees" value={managerDashboardMetrics.totalEmployees} icon={Users} description="Fictional preview metric" />
        <ManagerSummaryCard label="Pending approvals" value={pendingEmployees.length} icon={UserRoundClock} description="From the approval preview records" />
        <ManagerSummaryCard label="Active employees" value={managerDashboardMetrics.activeEmployees} icon={UserCheck} description="Fictional preview metric" />
        <ManagerSummaryCard label="Training programs" value={trainingPresentationSummary.totalPrograms} icon={BookOpenCheck} description="Fictional preview metric" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ApprovalOverview pendingEmployees={pendingEmployees} />
        <TrainingOverview summary={trainingPresentationSummary} />
      </div>

      <RecentActivity events={activityPresentationEvents} />
      <ManagerQuickNavigation />
    </div>
  )
}
