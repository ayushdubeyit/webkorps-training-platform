import { useManagerAccount } from '../../account/useManagerAccount'
import { Link } from 'react-router-dom'

const notificationOptions = [
  ['registrations', 'New employee registrations'],
  ['approvals', 'Employee approval updates'],
  ['training', 'Training and module updates'],
  ['tasks', 'Task assignments and deadlines'],
] as const

export function ManagerSettingsPage() {
  const { preferences, setNotification, setTableDensity, requestSignOut } = useManagerAccount()

  return <div className="mx-auto max-w-5xl space-y-7">
    <header><p className="text-sm font-semibold text-brand-primary">Manager workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Manage account display and local presentation preferences.</p></header>

    <section aria-labelledby="account-preferences" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="account-preferences" className="text-lg font-semibold text-slate-900">Account Preferences</h2>
      <p className="mt-1 text-sm text-slate-600">Presentation fixture · not an authenticated manager profile.</p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">{[['Name', 'Demo Manager'], ['Email', 'Not available'], ['Designation', 'Not available'], ['Department', 'Not available']].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 px-4 py-3"><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd></div>)}</dl>
      <Link to="/manager/profile" className="mt-4 inline-flex text-sm font-semibold text-brand-primary underline-offset-4 hover:underline">View manager profile</Link><p className="mt-2 text-xs text-slate-500">Profile editing is unavailable until an account profile service is connected.</p>
    </section>

    <section aria-labelledby="notification-preferences" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="notification-preferences" className="text-lg font-semibold text-slate-900">Notification Preferences</h2><p className="mt-1 text-sm leading-6 text-slate-600">These switches are saved in this browser only. They do not send email or backend notifications.</p>
      <div className="mt-5 divide-y divide-slate-100">{notificationOptions.map(([key, label]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><span className="text-sm font-medium text-slate-700">{label}</span><input type="checkbox" checked={preferences.notifications[key]} onChange={(event) => setNotification(key, event.target.checked)} aria-label={label} className="size-4 accent-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary" /></label>)}</div>
    </section>

    <section aria-labelledby="display-preferences" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="display-preferences" className="text-lg font-semibold text-slate-900">Display Preferences</h2><p className="mt-1 text-sm leading-6 text-slate-600">Table density is applied to the manager employee and approval tables, and saved in this browser only.</p>
      <fieldset className="mt-5"><legend className="text-sm font-medium text-slate-700">Table density</legend><div className="mt-3 flex flex-wrap gap-3">{(['comfortable', 'compact'] as const).map((density) => <label key={density} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm capitalize ${preferences.tableDensity === density ? 'border-brand-primary bg-brand-soft text-brand-dark-blue' : 'border-slate-200 text-slate-700'}`}><input type="radio" name="table-density" value={density} checked={preferences.tableDensity === density} onChange={() => setTableDensity(density)} className="accent-brand-primary" />{density}</label>)}</div></fieldset>
      <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Interface theme</p><p className="mt-1 text-sm font-medium text-slate-800">Light theme</p><p className="mt-1 text-xs text-slate-500">This preview currently supports the light interface only.</p></div>
    </section>

    <section aria-labelledby="security-session" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="security-session" className="text-lg font-semibold text-slate-900">Security &amp; Session</h2><div className="mt-4 space-y-3 text-sm"><p className="text-slate-700"><span className="font-medium">Authentication:</span> Not connected in this preview</p><div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3"><div><p className="font-medium text-slate-800">Password management</p><p className="mt-1 text-xs text-slate-500">Unavailable until a supported authentication workflow exists.</p></div><span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">Unavailable</span></div></div>
      <button type="button" onClick={requestSignOut} className="mt-5 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Sign Out</button>
      <p className="mt-2 text-xs text-slate-500">The confirmation explains that sign-out cannot change a session while authentication is disconnected.</p>
    </section>
  </div>
}
