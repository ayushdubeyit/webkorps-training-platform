import {
  trainingDocumentPresentationData,
  trainingModulePresentationData,
} from '../../../training/fixtures/trainingLibraryPresentationData'
import type { ManagedTrainingDocument, ManagedTrainingModule } from '../types/trainingManagement.types'

/** The manager preview reuses the shared training catalog fixtures. */
export const managedModulePresentationData: ManagedTrainingModule[] = trainingModulePresentationData

/** Metadata-only presentation records. No PDF file references are included. */
export const managedDocumentPresentationData: ManagedTrainingDocument[] = trainingDocumentPresentationData
