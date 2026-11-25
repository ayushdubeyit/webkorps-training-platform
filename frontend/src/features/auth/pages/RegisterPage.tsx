import { RegistrationForm } from '../components/RegistrationForm'
import { AuthLayout } from '../components/AuthLayout'
import { ClipboardCheck } from 'lucide-react'

export function RegisterPage() {
  return (
    <AuthLayout formType="register">
      <section className="auth-form-card" aria-labelledby="register-title">
        <p className="auth-form-card__eyebrow">EMPLOYEE REGISTRATION</p>
        <h1 id="register-title">Create your account</h1>
        <p className="auth-form-card__intro">Register with your official details to get started.</p>
        <div className="auth-approval-note"><ClipboardCheck aria-hidden="true" size={18} /><p><strong>Manager approval required</strong><span>Your account will need manager approval before platform access is available.</span></p></div>
        <div className="auth-form-card__form auth-form-card__form--register"><RegistrationForm /></div>
      </section>
    </AuthLayout>
  )
}
