import type {
  EmployeeActivityEvent,
  EmployeeTrainingModule,
} from '../types/employeeDashboard.types'
import { employeePresentationIdentity } from '../../../tasks/employeePresentationIdentity'

/** Fictional name for the employee dashboard presentation preview. */
export const employeePresentationName = employeePresentationIdentity?.fullName ?? 'Demo Employee'

/** Fictional training modules for presentation only; not API data. */
export const trainingModulePresentationData: EmployeeTrainingModule[] = [
  {
    id: 'preview-module-001',
    title: 'Secure Coding Essentials',
    description: 'Review core practices for writing and maintaining secure applications.',
    domain: 'Engineering',
    progressPercent: 100,
    completionStatus: 'COMPLETED',
  },
  {
    id: 'preview-module-002',
    title: 'Effective Product Discovery',
    description: 'Explore techniques for understanding user needs and shaping product ideas.',
    domain: 'Product',
    progressPercent: 60,
    completionStatus: 'IN_PROGRESS',
  },
  {
    id: 'preview-module-003',
    title: 'Inclusive Communication',
    description: 'Practice clear, thoughtful communication across teams.',
    domain: 'People & Culture',
    progressPercent: 35,
    completionStatus: 'IN_PROGRESS',
  },
  {
    id: 'preview-module-004',
    title: 'Data Privacy Foundations',
    description: 'Learn the foundations of responsible data handling at work.',
    domain: 'Security',
    progressPercent: 0,
    completionStatus: 'NOT_STARTED',
  },
]

/** Fictional activity examples; these are not audit history. */
export const activityPresentationData: EmployeeActivityEvent[] = [
  {
    id: 'preview-employee-event-001',
    title: 'Secure Coding Essentials completed',
    description: 'A fictional completion event for the dashboard preview.',
    label: 'Presentation sample',
  },
  {
    id: 'preview-employee-event-002',
    title: 'Effective Product Discovery in progress',
    description: 'A fictional learning activity for the dashboard preview.',
    label: 'Presentation sample',
  },
  {
    id: 'preview-employee-event-003',
    title: 'Learning workspace preview opened',
    description: 'A fictional learning activity for the dashboard preview.',
    label: 'Presentation sample',
  },
]
