import { createContext } from 'react'
import type { NewTaskAssignment, TaskAssignment, AssignedTaskStatus } from '../types/taskAssignment.types'

export interface TaskAssignmentContextValue {
  tasks: TaskAssignment[]
  assignTask: (employeeId: string, draft: NewTaskAssignment) => TaskAssignment | null
  updateTaskStatus: (taskId: string, nextStatus: AssignedTaskStatus) => boolean
}

export const TaskAssignmentContext = createContext<TaskAssignmentContextValue | null>(null)
