import type {
  LoginCredentials,
  LoginErrors,
  RegistrationData,
  RegistrationErrors,
} from './types/auth.types'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(values: LoginCredentials): LoginErrors {
  const errors: LoginErrors = {}
  const email = values.email.trim()

  if (!email) {
    errors.email = 'Official email is required.'
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export function validateRegistration(values: RegistrationData): RegistrationErrors {
  const errors: RegistrationErrors = {}
  const fullName = values.fullName.trim()
  const email = values.email.trim()
  const employeeCode = values.employeeCode.trim()
  const department = values.department.trim()

  if (!fullName) errors.fullName = 'Full name is required.'
  else if (fullName.length > 100) errors.fullName = 'Full name must be 100 characters or fewer.'

  if (!email) errors.email = 'Official email is required.'
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'
  else if (email.length > 150) errors.email = 'Email must be 150 characters or fewer.'

  if (employeeCode.length > 50) errors.employeeCode = 'Employee code must be 50 characters or fewer.'

  if (!department) errors.department = 'Department is required.'
  else if (department.length > 100) errors.department = 'Department must be 100 characters or fewer.'

  if (!values.password) errors.password = 'Password is required.'
  else if (values.password.length < 8 || values.password.length > 72) {
    errors.password = 'Password must be between 8 and 72 characters.'
  }

  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}
