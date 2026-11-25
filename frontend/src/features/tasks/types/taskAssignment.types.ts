export type AssignedTaskStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'

export interface TaskAssignment {
  id: string
  employeeId: string
  title: string
  description: string
  instructions: string
  referenceUrl?: string
  startDate: string
  deadline: string
  assignedAt: string
  assignedBy: string
  status: AssignedTaskStatus
}

export interface NewTaskAssignment {
  title: string
  description: string
  instructions: string
  referenceUrl?: string
  startDate: string
  deadline: string
}
