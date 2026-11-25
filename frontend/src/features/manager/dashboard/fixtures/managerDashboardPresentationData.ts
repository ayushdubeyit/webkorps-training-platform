import type { ActivityPresentationEvent, DashboardPresentationMetrics } from '../types/dashboard.types'

/** Clearly fictional presentation values. These are not live platform metrics. */
export const managerDashboardMetrics: DashboardPresentationMetrics = {
  totalEmployees: 248,
  activeEmployees: 231,
}

/** Presentation-only examples, not actual audit or activity records. */
export const activityPresentationEvents: ActivityPresentationEvent[] = [
  {
    id: 'preview-event-001',
    title: 'Employee registration received',
    description: 'A fictional sample event for the dashboard preview.',
    label: 'Presentation sample',
  },
  {
    id: 'preview-event-002',
    title: 'Training program published',
    description: 'A fictional sample event for the dashboard preview.',
    label: 'Presentation sample',
  },
  {
    id: 'preview-event-003',
    title: 'Employee learning plan updated',
    description: 'A fictional sample event for the dashboard preview.',
    label: 'Presentation sample',
  },
]
