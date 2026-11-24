import type { TrainingDocument, TrainingModule } from '../../../training/types/training.types'

export type ManagedTrainingModule = TrainingModule

export interface TrainingModuleDraft {
  name: string
  description: string
  category: string
}

export interface TrainingDocumentDraft {
  title: string
  description: string
  version: string
  file: File
}

export type ManagedTrainingDocument = TrainingDocument
