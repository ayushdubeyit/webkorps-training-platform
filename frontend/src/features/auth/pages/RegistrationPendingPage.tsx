import { Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/brand/webkorps_logo_blue_transparent.png'
import '../components/auth.css'

export function RegistrationPendingPage() {
  return (
    <main className="auth-pending-screen">
      <div className="auth-pending-screen__brand"><img src={logo} alt="Webkorps" /></div>
      <section className="auth-pending-card">
        <span className="auth-pending-card__icon"><Clock3 aria-hidden="true" size={25} /></span>
        <p className="auth-form-card__eyebrow">REGISTRATION STATUS</p>
        <h1>Manager approval required</h1>
        <p>Employee accounts require manager approval. If your registration has been submitted, you will be able to access the platform after it is approved.</p>
        <div className="auth-pending-card__steps"><strong>What happens next</strong><span>Your account remains pending until a manager reviews it.</span><span>Once approved, return here to sign in to the training platform.</span></div>
        <Link to="/login" className="auth-primary-action">Return to sign in</Link>
      </section>
      <p className="auth-pending-screen__footnote">Webkorps employee learning platform</p>
    </main>
  )
}
