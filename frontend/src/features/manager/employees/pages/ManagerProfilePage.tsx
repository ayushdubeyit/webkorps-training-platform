import { BriefcaseBusiness, Mail, UserRound } from 'lucide-react'
import { managerPresentationIdentity } from '../../account/managerPreferences'

const unavailableProfileFields = [
  { label: 'Name', icon: UserRound },
  { label: 'Email', icon: Mail },
  { label: 'Employee ID', icon: UserRound },
  { label: 'Designation', icon: BriefcaseBusiness },
  { label: 'Department', icon: BriefcaseBusiness },
]

export function ManagerProfilePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <header>
        <p className="text-sm font-semibold text-brand-primary">Manager workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Manager profile</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Review the manager account information available in this portal.</p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="manager-profile-heading">
        <div className="border-b border-slate-100 bg-gradient-to-r from-brand-soft to-white px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-brand-primary shadow-sm"><UserRound aria-hidden="true" size={25} /></span>
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark-blue">Account information</p><h2 id="manager-profile-heading" className="mt-1 text-xl font-semibold text-slate-900">Manager profile</h2></div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p role="note" className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">{managerPresentationIdentity.name} is a presentation fixture, not an authenticated user. Manager profile details and profile editing are not available in the current frontend account contract.</p>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {unavailableProfileFields.map(({ label, icon: Icon }) => <div key={label} className="flex gap-3"><span className="mt-0.5 text-slate-400"><Icon aria-hidden="true" size={17} /></span><div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-700">{label === 'Name' ? managerPresentationIdentity.name : 'Not available in this preview'}</dd></div></div>)}
          </dl>
        </div>
      </section>
    </div>
  )
}
