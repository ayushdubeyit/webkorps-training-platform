import { useEffect, useRef, useState } from 'react'
import { BookOpen, ChartNoAxesColumnIncreasing, ChevronDown, House, ListTodo, LogOut, Menu, UserRound, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import iconLogo from '../../assets/brand/webkorps_icon.png'
import { employeePresentationIdentity } from '../../features/tasks/employeePresentationIdentity'

const employeeNavigation = [
  { label: 'Home', to: '/employee', icon: House, end: true },
  { label: 'Profile', to: '/employee/profile', icon: UserRound, end: true },
  { label: 'Modules', to: '/employee/training', icon: BookOpen, end: false },
  { label: 'Tasks', to: '/employee/my-tasks', icon: ListTodo, end: true },
  { label: 'Tracker', to: '/employee/tracker', icon: ChartNoAxesColumnIncreasing, end: true },
]

export function EmployeeLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
    {mobileOpen && <button type="button" className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" aria-label="Close employee navigation" onClick={() => setMobileOpen(false)} />}

    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 md:sticky md:top-0 md:z-auto md:h-screen md:translate-x-0 md:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Employee sidebar">
      <div className="flex min-h-[80px] items-center justify-between border-b border-slate-100 px-5">
        <div className="flex items-center gap-3"><img src={iconLogo} alt="Webkorps" className="h-10 w-auto" /><div><p className="text-sm font-semibold text-slate-900">Employee Portal</p><p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Training Platform</p></div></div>
        <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Close employee navigation" onClick={() => setMobileOpen(false)}><X size={18} aria-hidden="true" /></button>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-6" aria-label="Employee navigation">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        {employeeNavigation.map(({ label, to, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${isActive ? 'bg-brand-soft text-brand-dark-blue' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
          {({ isActive }) => <><Icon size={18} aria-hidden="true" className={isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-600'} /><span>{label}</span>{isActive && <span className="ml-auto size-1.5 rounded-full bg-brand-primary" aria-hidden="true" />}</>}
        </NavLink>)}
      </nav>

      <EmployeeSidebarAccount key={location.pathname} onNavigate={() => setMobileOpen(false)} />
    </aside>

    <div className="flex min-h-screen min-w-0 flex-1 flex-col">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
        <button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary md:hidden" aria-label="Open employee navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu size={20} aria-hidden="true" /></button>
        <p className="text-sm font-semibold text-slate-800">Employee workspace</p>
      </header>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
    </div>
  </div>
}

function EmployeeSidebarAccount({ onNavigate }: { onNavigate: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [signOutNotice, setSignOutNotice] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const identity = employeePresentationIdentity
  const initials = identity?.fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() ?? 'DE'

  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !accountRef.current?.contains(event.target)) setMenuOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { setMenuOpen(false); accountButtonRef.current?.focus() }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown) }
  }, [menuOpen])

  function requestSignOut() {
    setMenuOpen(false)
    setSignOutNotice(false)
    setSignOutOpen(true)
  }

  return <div ref={accountRef} className="relative shrink-0 border-t border-slate-100 px-3 py-3">
    {menuOpen && <div role="menu" aria-label="Employee account" className="absolute inset-x-3 bottom-[calc(100%-4px)] z-50 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
      <Link role="menuitem" to="/employee/profile" onClick={() => { setMenuOpen(false); onNavigate() }} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-primary"><UserRound size={16} aria-hidden="true" />My Profile</Link>
      <button role="menuitem" type="button" onClick={requestSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-brand-primary"><LogOut size={16} aria-hidden="true" />Sign Out</button>
    </div>}
    <button ref={accountButtonRef} type="button" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-dark-blue">{initials}</span>
      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{identity?.fullName ?? 'Demo Employee'}</span><span className="block truncate text-xs text-slate-500">{identity?.role ? formatEmployeeRole(identity.role) : 'Demo account'}</span>{identity?.department && <span className="block truncate text-[11px] text-slate-500">{identity.department}</span>}</span>
      <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
    </button>
    <p className="px-2.5 pt-1 text-[10px] text-slate-400">Presentation fixture · not signed in</p>

    <EmployeeSignOutDialog open={signOutOpen} onClose={() => setSignOutOpen(false)} onConfirm={() => { setSignOutOpen(false); setSignOutNotice(true) }} />
    {signOutNotice && <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-amber-200 bg-white p-4 text-sm text-slate-700 shadow-lg">Actual sign-out will be connected during backend/auth integration. No session was changed.<button type="button" className="ml-3 font-semibold text-brand-primary underline" onClick={() => setSignOutNotice(false)}>Dismiss</button></div>}
  </div>
}

function EmployeeSignOutDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null)
  useEffect(() => {
    if (open && dialog && !dialog.open) dialog.showModal()
    if (!open && dialog?.open) dialog.close()
  }, [dialog, open])

  return <dialog ref={setDialog} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === dialog) onClose() }} aria-labelledby="employee-signout-title" aria-describedby="employee-signout-description" className="m-auto w-[min(92vw,440px)] rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/40">
    <div className="p-6 sm:p-7"><h2 id="employee-signout-title" className="text-xl font-semibold">Sign out?</h2><p id="employee-signout-description" className="mt-2 text-sm leading-6 text-slate-600">Are you sure you want to sign out of your employee account?</p><p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm leading-5 text-amber-900">Authentication is not connected in this preview. Actual sign-out will be connected during backend/auth integration.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Cancel</button><button type="button" onClick={onConfirm} className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">Sign Out</button></div></div>
  </dialog>
}

function formatEmployeeRole(role: string) {
  return role.toLocaleLowerCase().replace(/\b\w/g, (character) => character.toLocaleUpperCase())
}
