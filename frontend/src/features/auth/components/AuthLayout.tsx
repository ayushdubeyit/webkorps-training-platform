import type { ReactNode } from 'react'
import { AuthShowcase } from './AuthShowcase'
import './auth.css'

export function AuthLayout({ children, formType }: { children: ReactNode; formType: 'login' | 'register' }) {
  return (
    <div className="auth-shell">
      <AuthShowcase />
      <main className={`auth-panel auth-panel--${formType}`}>
        <div className="auth-panel__content">{children}</div>
        <p className="auth-panel__footnote">Webkorps employee learning platform</p>
      </main>
    </div>
  )
}
