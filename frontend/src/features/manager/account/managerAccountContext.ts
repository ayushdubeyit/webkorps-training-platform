import { createContext } from 'react'
import type { ManagerPreferences } from './managerPreferences'

export type ManagerAccountValue = {
  preferences: ManagerPreferences
  setNotification: (key: keyof ManagerPreferences['notifications'], checked: boolean) => void
  setTableDensity: (density: ManagerPreferences['tableDensity']) => void
  signOutOpen: boolean
  requestSignOut: () => void
  closeSignOut: () => void
  confirmSignOut: () => void
  signOutNotice: boolean
  clearSignOutNotice: () => void
}

export const ManagerAccountContext = createContext<ManagerAccountValue | null>(null)
