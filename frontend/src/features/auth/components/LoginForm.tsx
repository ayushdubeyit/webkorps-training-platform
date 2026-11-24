import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthFeedback } from './AuthFeedback'
import { PasswordField } from './PasswordField'
import type { AuthFeedbackMessage, LoginCredentials, LoginErrors } from '../types/auth.types'
import { validateLogin } from '../validation'

interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => Promise<void>
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [values, setValues] = useState<LoginCredentials>({ email: '', password: '' })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [feedback, setFeedback] = useState<AuthFeedbackMessage | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateLogin(values)
    setErrors(nextErrors)
    setFeedback(null)
    if (Object.keys(nextErrors).length > 0) return
    if (!onSubmit) {
      setFeedback({ kind: 'service-unavailable' })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ ...values, email: values.email.trim() })
    } catch {
      setFeedback({ kind: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  function update<K extends keyof LoginCredentials>(key: K, value: LoginCredentials[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {feedback && <AuthFeedback feedback={feedback} />}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">Official email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={values.email}
          onChange={(event) => update('email', event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 aria-[invalid=true]:border-red-600"
        />
        {errors.email && <p id="login-email-error" className="text-xs font-medium text-red-700">{errors.email}</p>}
      </div>
      <PasswordField
        id="login-password"
        name="password"
        label="Password"
        autoComplete="current-password"
        required
        value={values.password}
        onChange={(event) => update('password', event.target.value)}
        error={errors.password}
      />
      <div className="flex justify-end">
        <a
          href="#forgot-password"
          onClick={(event) => event.preventDefault()}
          aria-disabled="true"
          title="Available in a future release"
          className="cursor-not-allowed text-sm text-slate-400 underline decoration-dotted underline-offset-4"
        >
          Forgot password?
        </a>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-center text-sm text-slate-600">
        New to Webkorps Training?{' '}
        <Link to="/register" className="font-semibold text-brand-primary underline-offset-4 hover:underline">Create an account</Link>
      </p>
    </form>
  )
}
