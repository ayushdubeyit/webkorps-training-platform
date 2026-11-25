import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { employeeDirectoryPresentationData } from '../../manager/employees/fixtures/employeeDirectoryPresentationData'
import { TaskAssignmentContext } from './TaskAssignmentContext'
import type { NewTaskAssignment, TaskAssignment, AssignedTaskStatus } from '../types/taskAssignment.types'
import { localDateToday } from '../utils/taskDates'

export function TaskAssignmentProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskAssignment[]>([])

  const assignTask = useCallback((employeeId: string, draft: NewTaskAssignment) => {
    const employee = employeeDirectoryPresentationData.find((record) => record.id === employeeId && record.accountStatus === 'APPROVED')
    if (!employee || !draft.title.trim() || !draft.description.trim() || !draft.instructions.trim() || !draft.startDate || !draft.deadline || draft.deadline < draft.startDate) return null
    const task: TaskAssignment = {
      ...draft,
      id: createTaskId(),
      employeeId: employee.id,
      title: draft.title.trim(),
      description: draft.description.trim(),
      instructions: draft.instructions.trim(),
      referenceUrl: draft.referenceUrl?.trim() || undefined,
      assignedAt: localDateToday(),
      assignedBy: 'Demo Manager',
      status: 'ASSIGNED',
    }
    setTasks((current) => [...current, task])
    return task
  }, [])

  const updateTaskStatus = useCallback((taskId: string, nextStatus: AssignedTaskStatus) => {
    const task = tasks.find((item) => item.id === taskId)
    const validTransition = task && ((task.status === 'ASSIGNED' && nextStatus === 'IN_PROGRESS') || (task.status === 'IN_PROGRESS' && nextStatus === 'COMPLETED'))
    if (!validTransition) return false
    setTasks((current) => current.map((item) => item.id === taskId ? { ...item, status: nextStatus } : item))
    return true
  }, [tasks])

  const value = useMemo(() => ({ tasks, assignTask, updateTaskStatus }), [tasks, assignTask, updateTaskStatus])
  return <TaskAssignmentContext.Provider value={value}>{children}</TaskAssignmentContext.Provider>
}

function createTaskId() {
  return `local-task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
