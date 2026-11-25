import type { ApprovalEmployee } from '../../approvals/types/approval.types'

/** Optional fields are shown only when a profile source supplies them. */
export type EmployeeDirectoryRecord = Omit<ApprovalEmployee, 'employeeCode' | 'department'> & Partial<Pick<ApprovalEmployee, 'employeeCode' | 'department'>> & {
  designation?: string
  joiningDate?: string
}

export type EmployeeDirectorySortKey = 'fullName' | 'designation' | 'employeeCode' | 'joiningDate'
