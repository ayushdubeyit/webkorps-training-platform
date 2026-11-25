import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import type { NetworkErrorKind } from '../components/ui/NetworkErrorState'

export type NetworkRequestError = { kind: NetworkErrorKind; message: string }

export type NetworkRequestState<T> =
  | { status: 'idle' | 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: NetworkRequestError }

/** Runs a real request and retains the failed request callback for an actual retry. */
export function useNetworkRequest<T>() {
  const [state, setState] = useState<NetworkRequestState<T>>({ status: 'idle' })
  const mounted = useRef(false)
  const runId = useRef(0)
  const lastRequest = useRef<(() => Promise<T>) | null>(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      runId.current += 1
    }
  }, [])

  const run = useCallback(async (request: () => Promise<T>): Promise<T | undefined> => {
    lastRequest.current = request
    const thisRun = ++runId.current
    if (mounted.current) setState({ status: 'loading' })
    try {
      const data = await request()
      if (mounted.current && runId.current === thisRun) setState({ status: 'success', data })
      return data
    } catch (cause) {
      const error = classifyNetworkError(cause)
      if (mounted.current && runId.current === thisRun) setState({ status: 'error', error })
      return undefined
    }
  }, [])

  const retry = useCallback(() => lastRequest.current ? run(lastRequest.current) : Promise.resolve(undefined), [run])

  return { state, run, retry }
}

function classifyNetworkError(cause: unknown): NetworkRequestError {
  if (axios.isAxiosError(cause)) {
    if (!cause.response) return { kind: 'network', message: 'Unable to connect. Check your connection and try again.' }
    if (cause.response.status === 400 || cause.response.status === 422) return { kind: 'validation', message: 'The server could not accept the submitted information. Review it and try again.' }
    if (cause.response.status >= 500) return { kind: 'server', message: 'The service encountered an error. Please try again later.' }
    return { kind: 'client', message: 'The request could not be completed.' }
  }

  if (cause instanceof TypeError && /network|fetch|load failed/i.test(cause.message)) {
    return { kind: 'network', message: 'Unable to connect. Check your connection and try again.' }
  }
  return { kind: 'unknown', message: 'Something went wrong while loading this information.' }
}
