import { WebkorpsLoader } from './WebkorpsLoader'

interface LoadingStateProps {
  message: string
  filename?: string
  size?: number
  className?: string
}

export function LoadingState({ message, filename, size = 68, className = '' }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className={`flex min-h-[45vh] flex-col items-center justify-center gap-4 rounded-xl text-center ${className}`}>
      <span aria-hidden="true"><WebkorpsLoader size={size} /></span>
      <span className="space-y-1">
        <span className="block text-sm font-medium text-slate-700">{message}</span>
        {filename && <span className="block max-w-[min(28rem,80vw)] break-all text-xs text-slate-500">{filename}</span>}
      </span>
    </div>
  )
}
