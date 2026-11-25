import { approvalPresentationData } from '../../approvals/fixtures/approvalPresentationData'
import type { EmployeeDirectoryRecord } from '../types/employeeDirectory.types'

/** Derived from the existing fictional approval preview; only approved entries are listed. */
export const employeeDirectoryPresentationData: EmployeeDirectoryRecord[] = approvalPresentationData
  .filter((employee) => employee.accountStatus === 'APPROVED')
