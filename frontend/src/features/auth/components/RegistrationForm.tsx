import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthFeedback } from './AuthFeedback'
import { PasswordField } from './PasswordField'
import type {
  AuthFeedbackMessage,
  RegistrationData,
  RegistrationErrors,
} from '../types/auth.types'
import { validateRegistration } from '../validation'

interface RegistrationFormProps {
  onSubmit?: (registration: RegistrationData) => Promise<void>
}

const initialValues: RegistrationData = {
  fullName: '',
  email: '',
  employeeCode: '',
  department: '',
  password: '',
  confirmPassword: '',
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [values, setValues] = useState<RegistrationData>(initialValues)
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [feedback, setFeedback] = useState<AuthFeedbackMessage | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateRegistration(values)
    setErrors(nextErrors)
    setFeedback(null)
    if (Object.keys(nextErrors).length > 0) return
    if (!onSubmit) {
      setFeedback({ kind: 'service-unavailable' })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...values,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        employeeCode: values.employeeCode.trim(),
        department: values.department.trim(),
      })
    } catch {
      setFeedback({ kind: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  function update<K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {feedback && <AuthFeedback feedback={feedback} />}
      <TextField id="register-full-name" name="fullName" label="Full name" autoComplete="name" required value={values.fullName} onChange={(value) => update('fullName', value)} error={errors.fullName} />
      <TextField id="register-email" name="email" label="Official email" type="email" autoComplete="email" required value={values.email} onChange={(value) => update('email', value)} error={errors.email} />
      <TextField id="register-employee-code" name="employeeCode" label="Employee code" autoComplete="off" value={values.employeeCode} onChange={(value) => update('employeeCode', value)} error={errors.employeeCode} />
      <TextField id="register-department" name="department" label="Department" autoComplete="organization-title" required value={values.department} onChange={(value) => update('department', value)} error={errors.department} />
      <PasswordField
        id="register-password"
        name="password"
        label="Password"
        autoComplete="new-password"
        required
        value={values.password}
        onChange={(event) => update('password', event.target.value)}
        error={errors.password}
        hint="Use 8 to 72 characters."
      />
      <PasswordField
        id="register-confirm-password"
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        required
        value={values.confirmPassword}
        onChange={(event) => update('confirmPassword', event.target.value)}
        error={errors.confirmPassword}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? 'Creating account…' : 'Create employee account'}
      </button>
      <p className="text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-brand-primary underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </form>
  )
}

interface TextFieldProps {
  id: string
  name: string
  label: string
  type?: 'text' | 'email'
  autoComplete: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  error?: string
}

function TextField({
  id,
  name,
  label,
  type = 'text',
  autoComplete,
  required = false,
  value,
  onChange,
  error,
}: TextFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 aria-[invalid=true]:border-red-600"
      />
      {error && <p id={errorId} className="text-xs font-medium text-red-700">{error}</p>}
    </div>
  )
}
