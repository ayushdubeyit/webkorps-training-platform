import { useOutletContext } from 'react-router-dom'
import type { ManagedTrainingModule } from '../types/trainingManagement.types'

export interface TrainingManagementOutletContext {
  modules: ManagedTrainingModule[]
  expandedProjectToolsSubcategoryId: string | null
  setExpandedProjectToolsSubcategoryId: (id: string | null) => void
}

export function useTrainingManagementContext() {
  return useOutletContext<TrainingManagementOutletContext>()
}
