import { createContext } from 'react'
import type { TrainingDocument, TrainingResource, TrainingResourceFileDraft, TrainingSubcategory, TrainingTool } from '../types/training.types'

export interface TrainingPresentationContextValue {
  subcategories: TrainingSubcategory[]
  tools: TrainingTool[]
  resources: TrainingResource[]
  documents: TrainingDocument[]
  addDocument: (moduleId: string, draft: { title: string; description: string; version: string; file: File }) => string | null
  replaceDocument: (id: string, draft: { title: string; description: string; version: string; file: File }) => string | null
  removeDocument: (id: string) => void
  addSubcategory: (name: string, description: string) => TrainingSubcategory
  updateSubcategory: (id: string, name: string, description: string) => void
  removeSubcategory: (id: string) => void
  addTool: (subcategoryId: string, name: string, description: string) => TrainingTool
  updateTool: (id: string, name: string, description: string) => void
  removeTool: (id: string) => void
  addResource: (toolId: string, draft: TrainingResourceFileDraft) => string | null
  replaceResource: (id: string, draft: TrainingResourceFileDraft) => string | null
  removeResource: (id: string) => void
}

export const TrainingPresentationContext = createContext<TrainingPresentationContextValue | null>(null)
