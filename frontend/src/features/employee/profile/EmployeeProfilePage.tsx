import { ArrowLeft, BriefcaseBusiness, Building2, IdCard, Mail, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { employeePresentationIdentity } from '../../tasks/employeePresentationIdentity'

export function EmployeeProfilePage() {
  const employee = employeePresentationIdentity

  return <div className="mx-auto max-w-5xl space-y-7">
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500"><Link to="/employee" className="hover:text-brand-dark-blue hover:underline">Employee workspace</Link><span aria-hidden="true">/</span><span aria-current="page" className="font-medium text-slate-800">Profile</span></nav>
    <header><p className="text-sm font-semibold text-brand-primary">Employee workspace · Presentation preview</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">My Profile</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Employee details currently available in this preview.</p></header>
    <section aria-labelledby="employee-profile-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-brand-soft to-white px-5 py-6 sm:px-7"><div className="flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-xl bg-white text-brand-primary shadow-sm"><UserRound aria-hidden="true" size={23} /></span><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark-blue">Profile information</p><h2 id="employee-profile-heading" className="mt-1 text-xl font-semibold text-slate-900">{employee?.fullName ?? 'Demo Employee'}</h2></div></div></div>
      <div className="p-5 sm:p-7"><p role="note" className="mb-6 rounded-lg border border-brand-secondary/40 bg-brand-soft px-4 py-3 text-sm leading-6 text-slate-700">{employee ? 'This is the selected employee presentation fixture, not authenticated profile data. Details not available in the fixture are marked as unavailable.' : 'Employee profile data is not available in this preview. No personal details are shown.'}</p>
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <ProfileField label="Full name" value={employee?.fullName} icon={UserRound} />
          <ProfileField label="Email" value={employee?.email} icon={Mail} />
          <ProfileField label="Employee ID" value={employee?.employeeCode} icon={IdCard} />
          <ProfileField label="Role" value={employee?.role.toLocaleLowerCase()} icon={BriefcaseBusiness} />
          <ProfileField label="Designation" value={employee?.designation} icon={BriefcaseBusiness} />
          <ProfileField label="Department" value={employee?.department} icon={Building2} />
        </dl>
        <Link to="/employee" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"><ArrowLeft aria-hidden="true" size={16} />Back to Home</Link>
      </div>
    </section>
  </div>
}

function ProfileField({ label, value, icon: Icon }: { label: string; value?: string | null; icon: typeof UserRound }) {
  return <div className="flex gap-3"><span className="mt-0.5 text-slate-400"><Icon aria-hidden="true" size={17} /></span><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-800">{value || <span className="italic font-normal text-slate-400">Not available in this preview</span>}</dd></div></div>
}
