import fullLogo from '../../assets/brand/webkorps_logo.png'
import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-brand-dark-blue">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <img
            src={fullLogo}
            alt="Webkorps"
            className="h-auto w-48 max-w-full sm:w-56"
          />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-slate-500">
          Internal employee training platform
        </p>
      </footer>
    </div>
  )
}
