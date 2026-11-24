export type NetworkErrorKind = 'network' | 'validation' | 'client' | 'server' | 'unknown'

interface NetworkErrorStateProps {
  kind: NetworkErrorKind
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
}

const defaultMessages: Record<NetworkErrorKind, string> = {
  network: 'Unable to connect. Check your connection and try again.',
  validation: 'The server could not accept the submitted information. Review it and try again.',
  client: 'The request could not be completed.',
  server: 'The service encountered an error. Please try again later.',
  unknown: 'Something went wrong while loading this information.',
}

export function NetworkErrorState({ kind, message, onRetry, isRetrying = false }: NetworkErrorStateProps) {
  const canRetry = Boolean(onRetry) && (kind === 'network' || kind === 'server')

  return (
    <section role="alert" aria-live="assertive" className="rounded-xl border border-amber-200 bg-white p-6 text-center shadow-sm">
      <h2 className="font-semibold text-slate-900">{kind === 'network' ? 'Connection problem' : kind === 'server' ? 'Service unavailable' : 'Request error'}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{message ?? defaultMessages[kind]}</p>
      {canRetry && <button type="button" onClick={onRetry} disabled={isRetrying} className="mt-4 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 disabled:cursor-wait disabled:opacity-70">{isRetrying ? 'Retrying…' : 'Retry'}</button>}
    </section>
  )
}
