export interface LoginCredentials {
  email: string
  password: string
}

export interface RegistrationData {
  fullName: string
  email: string
  employeeCode: string
  department: string
  password: string
  confirmPassword: string
}

export type LoginField = keyof LoginCredentials
export type RegistrationField = keyof RegistrationData

export type LoginErrors = Partial<Record<LoginField, string>>
export type RegistrationErrors = Partial<Record<RegistrationField, string>>

export type AuthFeedbackKind =
  | 'invalid-credentials'
  | 'pending'
  | 'rejected'
  | 'suspended'
  | 'service-unavailable'
  | 'error'

export interface AuthFeedbackMessage {
  kind: AuthFeedbackKind
  message?: string
}
