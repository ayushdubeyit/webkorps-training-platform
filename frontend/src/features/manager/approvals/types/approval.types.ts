import type { AccountStatus, UserRole } from '../../../../types'

export interface ApprovalEmployee {
  id: string
  fullName: string
  email: string
  employeeCode: string
  department: string
  role: UserRole
  accountStatus: AccountStatus
}

export type ApprovalAction = 'approve' | 'reject'
export type ApprovalStatusFilter = 'ALL' | AccountStatus
