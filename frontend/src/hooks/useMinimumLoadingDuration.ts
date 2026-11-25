import { useEffect, useState } from 'react'

/** Keeps a keyed loading state visible for at least the requested duration. */
export function useMinimumLoadingDuration(key: string | null, durationMs: number) {
  const [completedKey, setCompletedKey] = useState<string | null>(null)

  useEffect(() => {
    if (!key) return
    const timer = window.setTimeout(() => setCompletedKey(key), Math.max(0, durationMs))
    return () => window.clearTimeout(timer)
  }, [durationMs, key])

  return key !== null && completedKey !== key
}
