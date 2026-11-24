import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ManagerAccountContext, type ManagerAccountValue } from './managerAccountContext'
import { defaultManagerPreferences, type ManagerPreferences } from './managerPreferences'
const preferenceKey = 'webkorps.manager.preferences.v1'

function readPreferences(): ManagerPreferences {
  try {
    const value = localStorage.getItem(preferenceKey)
    if (!value) return defaultManagerPreferences
    const parsed = JSON.parse(value) as Partial<ManagerPreferences>
    return {
      notifications: { ...defaultManagerPreferences.notifications, ...parsed.notifications },
      tableDensity: parsed.tableDensity === 'compact' ? 'compact' : 'comfortable',
    }
  } catch {
    return defaultManagerPreferences
  }
}

export function ManagerAccountProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(readPreferences)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [signOutNotice, setSignOutNotice] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(preferenceKey, JSON.stringify(preferences)) } catch { /* Preferences remain available for this session. */ }
  }, [preferences])

  const value = useMemo<ManagerAccountValue>(() => ({
    preferences,
    setNotification: (key, checked) => setPreferences((current) => ({ ...current, notifications: { ...current.notifications, [key]: checked } })),
    setTableDensity: (tableDensity) => setPreferences((current) => ({ ...current, tableDensity })),
    signOutOpen,
    requestSignOut: () => { setSignOutNotice(false); setSignOutOpen(true) },
    closeSignOut: () => setSignOutOpen(false),
    confirmSignOut: () => { setSignOutOpen(false); setSignOutNotice(true) },
    signOutNotice,
    clearSignOutNotice: () => setSignOutNotice(false),
  }), [preferences, signOutOpen, signOutNotice])

  return <ManagerAccountContext.Provider value={value}>{children}<SignOutDialog value={value} /></ManagerAccountContext.Provider>
}

function SignOutDialog({ value }: { value: ManagerAccountValue }) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null)
  useEffect(() => {
    if (value.signOutOpen && dialog && !dialog.open) dialog.showModal()
    if (!value.signOutOpen && dialog?.open) dialog.close()
  }, [dialog, value.signOutOpen])

  return <>
    <dialog ref={setDialog} onCancel={(event) => { event.preventDefault(); value.closeSignOut() }} onClick={(event) => { if (event.target === dialog) value.closeSignOut() }} aria-labelledby="manager-signout-title" aria-describedby="manager-signout-description" className="m-auto w-[min(92vw,440px)] rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
      <div className="p-6 sm:p-7">
        <h2 id="manager-signout-title" className="text-xl font-semibold">Sign out?</h2>
        <p id="manager-signout-description" className="mt-2 text-sm leading-6 text-slate-600">Are you sure you want to sign out of your manager account?</p>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm leading-5 text-amber-900">Authentication is not connected in this preview. Sign out is unavailable, and no session will be changed.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={value.closeSignOut} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Cancel</button>
          <button type="button" onClick={value.confirmSignOut} className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Sign Out</button>
        </div>
      </div>
    </dialog>
    {value.signOutNotice && <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-amber-200 bg-white p-4 text-sm text-slate-700 shadow-lg">Sign-out unavailable: authentication is not connected. No session was changed.<button type="button" className="ml-3 font-semibold text-brand-primary underline" onClick={value.clearSignOutNotice}>Dismiss</button></div>}
  </>
}
