import { useContext } from 'react'
import { TaskAssignmentContext } from '../context/TaskAssignmentContext'

export function useTaskAssignments() {
  const value = useContext(TaskAssignmentContext)
  if (!value) throw new Error('useTaskAssignments must be used within TaskAssignmentProvider')
  return value
}
