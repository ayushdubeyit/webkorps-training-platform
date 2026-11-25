export interface DashboardPresentationMetrics {
  totalEmployees: number
  activeEmployees: number
}

export interface TrainingPresentationSummary {
  totalPrograms: number
  publishedPrograms: number
  draftPrograms: number
}

export interface ActivityPresentationEvent {
  id: string
  title: string
  description: string
  label: string
}
