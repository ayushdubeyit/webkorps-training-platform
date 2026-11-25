import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { AuthLayout } from '../components/AuthLayout'

export function LoginPage() {
  return (
    <AuthLayout formType="login">
      <section className="auth-form-card" aria-labelledby="login-title">
        <p className="auth-form-card__eyebrow">WELCOME BACK</p>
        <h1 id="login-title">Sign in to your account</h1>
        <p className="auth-form-card__intro">Use your official email and password to continue to your learning space.</p>
        <div className="auth-form-card__form"><LoginForm /></div>
        <p className="auth-form-card__alternate">Need an account? <Link to="/register">Register as an employee</Link></p>
      </section>
    </AuthLayout>
  )
}
