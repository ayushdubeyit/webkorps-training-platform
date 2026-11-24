import type { ActivityPresentationEvent } from '../../../manager/dashboard/types/dashboard.types'

export type TrainingCompletionStatus = 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED'

export interface EmployeeTrainingModule {
  id: string
  title: string
  description: string
  domain: string
  progressPercent: number
  completionStatus: TrainingCompletionStatus
}

export type EmployeeActivityEvent = ActivityPresentationEvent
