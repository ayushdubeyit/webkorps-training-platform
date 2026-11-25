import { useContext } from 'react'
import { ManagerAccountContext } from './managerAccountContext'

export function useManagerAccount() {
  const value = useContext(ManagerAccountContext)
  if (!value) throw new Error('useManagerAccount must be used within ManagerAccountProvider')
  return value
}
