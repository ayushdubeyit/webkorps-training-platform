export const managerPresentationIdentity = {
  name: 'Demo Manager',
  role: 'Manager · Preview account',
  email: null as string | null,
  designation: null as string | null,
  department: null as string | null,
}

export type ManagerPreferences = {
  notifications: { registrations: boolean; approvals: boolean; training: boolean; tasks: boolean }
  tableDensity: 'comfortable' | 'compact'
}

export const defaultManagerPreferences: ManagerPreferences = {
  notifications: { registrations: false, approvals: false, training: false, tasks: false },
  tableDensity: 'comfortable',
}
