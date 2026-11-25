import type { AuthFeedbackMessage } from '../types/auth.types'

const feedbackCopy: Record<AuthFeedbackMessage['kind'], string> = {
  'invalid-credentials': 'The email or password is incorrect. Check your details and try again.',
  pending: 'Your account is awaiting manager approval. Access will be available after approval.',
  rejected: 'This account registration was rejected. Contact your manager for assistance.',
  suspended: 'This account is suspended. Contact your manager for assistance.',
  'service-unavailable': 'Authentication is not connected yet. Your details have not been sent.',
  error: 'We could not process that request. Please try again later.',
}

const feedbackStyle: Record<AuthFeedbackMessage['kind'], string> = {
  'invalid-credentials': 'border-red-200 bg-red-50 text-red-900',
  pending: 'border-brand-secondary/50 bg-brand-soft text-slate-900',
  rejected: 'border-red-200 bg-red-50 text-red-900',
  suspended: 'border-red-200 bg-red-50 text-red-900',
  'service-unavailable': 'border-slate-200 bg-slate-50 text-slate-800',
  error: 'border-red-200 bg-red-50 text-red-900',
}

export function AuthFeedback({ feedback }: { feedback: AuthFeedbackMessage }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-lg border px-4 py-3 text-sm ${feedbackStyle[feedback.kind]}`}
    >
      {feedback.message ?? feedbackCopy[feedback.kind]}
    </div>
  )
}
