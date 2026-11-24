import type { ApprovalEmployee } from '../types/approval.types'

/** Fictional preview records for presentation only. Never use as API data. */
export const approvalPresentationData: ApprovalEmployee[] = [
  {
    id: 'preview-employee-001',
    fullName: 'Avery Morgan',
    email: 'avery.morgan@example.com',
    employeeCode: 'WK-PREVIEW-101',
    department: 'Engineering',
    role: 'EMPLOYEE',
    accountStatus: 'PENDING',
  },
  {
    id: 'preview-employee-002',
    fullName: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    employeeCode: 'WK-PREVIEW-102',
    department: 'Product',
    role: 'EMPLOYEE',
    accountStatus: 'PENDING',
  },
  {
    id: 'preview-employee-003',
    fullName: 'Casey Patel',
    email: 'casey.patel@example.com',
    employeeCode: 'WK-PREVIEW-103',
    department: 'People Operations',
    role: 'EMPLOYEE',
    accountStatus: 'APPROVED',
  },
  {
    id: 'preview-employee-004',
    fullName: 'Taylor Chen',
    email: 'taylor.chen@example.com',
    employeeCode: 'WK-PREVIEW-104',
    department: 'Design',
    role: 'EMPLOYEE',
    accountStatus: 'APPROVED',
  },
  {
    id: 'preview-employee-005',
    fullName: 'Riley Brooks',
    email: 'riley.brooks@example.com',
    employeeCode: 'WK-PREVIEW-105',
    department: 'Finance',
    role: 'EMPLOYEE',
    accountStatus: 'REJECTED',
  },
  {
    id: 'preview-employee-006',
    fullName: 'Sam Rivera',
    email: 'sam.rivera@example.com',
    employeeCode: 'WK-PREVIEW-106',
    department: 'Operations',
    role: 'EMPLOYEE',
    accountStatus: 'SUSPENDED',
  },
]
