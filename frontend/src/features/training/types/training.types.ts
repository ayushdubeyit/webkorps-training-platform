export interface TrainingModule {
  id: string
  name: string
  description: string
  category: string
}

export interface TrainingDomain {
  id: string
  name: string
  description: string
  supportsVideo: boolean
}

export interface TrainingSubcategory {
  id: string
  domainId: string
  name: string
  description: string
}

export interface TrainingTool {
  id: string
  subcategoryId: string
  name: string
  description: string
}

export type TrainingResourceType = 'DOCUMENT' | 'VIDEO'

export interface TrainingResource {
  id: string
  toolId: string
  type: TrainingResourceType
  title: string
  description: string
  fileName: string
  fileSizeBytes: number
  mimeType: string
  version?: string
  uploadedAt?: string
  /** Empty for metadata-only fixtures; blob URLs are session-local previews. */
  fileReference?: string
}

export interface TrainingResourceFileDraft {
  type: TrainingResourceType
  title: string
  description: string
  version?: string
  file: File
}

export interface TrainingDocument {
  id: string
  moduleId: string
  title: string
  description: string
  fileName: string
  fileSizeBytes: number
  version: string
  uploadedAt?: string
  /** Empty for metadata-only fixtures; blob URLs are session-local previews. */
  fileReference?: string
}
