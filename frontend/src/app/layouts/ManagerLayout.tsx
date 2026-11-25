import { useEffect, useRef, useState } from 'react'
import { BookOpen, ChevronDown, ClipboardCheck, LogOut, Menu, Settings, UserRound, Users, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import iconLogo from '../../assets/brand/webkorps_icon.png'
import { ManagerAccountProvider } from '../../features/manager/account/managerAccount'
import { managerPresentationIdentity } from '../../features/manager/account/managerPreferences'
import { useManagerAccount } from '../../features/manager/account/useManagerAccount'

const managerNavigation = [
  { label: 'Profile', to: '/manager/profile', icon: UserRound, end: true },
  { label: 'All Employees', to: '/manager/employees', icon: Users, end: false },
  { label: 'Approval', to: '/manager/approvals', icon: ClipboardCheck, end: true },
  { label: 'Modules', to: '/manager/training', icon: BookOpen, end: false },
  { label: 'Settings', to: '/manager/settings', icon: Settings, end: true },
]

export function ManagerLayout() {
  return <ManagerAccountProvider><ManagerWorkspace /></ManagerAccountProvider>
}

function ManagerWorkspace() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      {mobileOpen && <button type="button" className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" aria-label="Close manager navigation" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:shadow-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Manager sidebar">
        <div className="flex min-h-[80px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <img src={iconLogo} alt="Webkorps" className="h-10 w-auto" />
            <div><p className="text-sm font-semibold text-slate-900">Manager Portal</p><p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Training Platform</p></div>
          </div>
          <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Close manager navigation" onClick={() => setMobileOpen(false)}><X size={18} aria-hidden="true" /></button>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-6" aria-label="Manager navigation">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
          {managerNavigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${isActive ? 'bg-brand-soft text-brand-dark-blue' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              {({ isActive }) => <><Icon size={18} aria-hidden="true" className={isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-600'} /><span>{label}</span>{isActive && <span className="ml-auto size-1.5 rounded-full bg-brand-primary" aria-hidden="true" />}</>}
            </NavLink>
          ))}
        </nav>

        <ManagerSidebarAccount key={location.pathname} onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary md:hidden" aria-label="Open manager navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu size={20} aria-hidden="true" /></button>
          <p className="text-sm font-semibold text-slate-800">Manager workspace</p>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}

function ManagerSidebarAccount({ onNavigate }: { onNavigate: () => void }) {
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const { requestSignOut } = useManagerAccount()

  useEffect(() => {
    if (!accountOpen) return
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !accountRef.current?.contains(event.target)) setAccountOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { setAccountOpen(false); accountButtonRef.current?.focus() }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown) }
  }, [accountOpen])

  return <div ref={accountRef} className="relative shrink-0 border-t border-slate-100 px-3 py-3">
    {accountOpen && <div role="menu" aria-label="Manager account" className="absolute inset-x-3 bottom-[calc(100%-4px)] z-50 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
      <Link role="menuitem" to="/manager/profile" onClick={() => { setAccountOpen(false); onNavigate() }} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-primary"><UserRound size={16} aria-hidden="true" />My Profile</Link>
      <Link role="menuitem" to="/manager/settings" onClick={() => { setAccountOpen(false); onNavigate() }} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-primary"><Settings size={16} aria-hidden="true" />Settings</Link>
      <button role="menuitem" type="button" onClick={() => { setAccountOpen(false); requestSignOut() }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-brand-primary"><LogOut size={16} aria-hidden="true" />Sign Out</button>
    </div>}
    <button ref={accountButtonRef} type="button" aria-haspopup="menu" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-dark-blue">DM</span>
      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{managerPresentationIdentity.name}</span><span className="block truncate text-xs text-slate-500">{managerPresentationIdentity.role}</span></span>
      <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-slate-400 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
    </button>
    <p className="px-2.5 pt-1 text-[10px] text-slate-400">Presentation fixture · not signed in</p>
  </div>
}
