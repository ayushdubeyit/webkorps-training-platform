import { useEffect, useRef, useState, type ReactNode } from 'react'
import { projectToolsResourcePresentationData, projectToolsSubcategoryPresentationData, projectToolsToolPresentationData } from '../../features/training/fixtures/projectToolsPresentationData'
import type { TrainingResource, TrainingResourceFileDraft } from '../../features/training/types/training.types'
import { isTrainingResourceTypeAllowed } from '../../features/training/utils/trainingResourcePolicy'
import { trainingDomainPresentationData } from '../../features/training/fixtures/trainingLibraryPresentationData'
import { trainingDocumentPresentationData } from '../../features/training/fixtures/trainingLibraryPresentationData'
import { TrainingPresentationContext } from '../../features/training/context/trainingPresentationContext'

export function TrainingPresentationProvider({ children }: { children: ReactNode }) {
  const [subcategories, setSubcategories] = useState(projectToolsSubcategoryPresentationData)
  const [tools, setTools] = useState(projectToolsToolPresentationData)
  const [resources, setResources] = useState(projectToolsResourcePresentationData)
  const [documents, setDocuments] = useState(trainingDocumentPresentationData)
  const objectUrls = useRef(new Set<string>())

  useEffect(() => () => {
    for (const url of objectUrls.current) URL.revokeObjectURL(url)
    objectUrls.current.clear()
  }, [])

  function addSubcategory(name: string, description: string) {
    const subcategory = { id: createId('subcategory'), domainId: 'project-tools', name, description }
    setSubcategories((current) => [...current, subcategory])
    return subcategory
  }

  function updateSubcategory(id: string, name: string, description: string) {
    setSubcategories((current) => current.map((item) => item.id === id ? { ...item, name, description } : item))
  }

  function removeSubcategory(id: string) {
    const childToolIds = tools.filter((tool) => tool.subcategoryId === id).map((tool) => tool.id)
    const removedResources = resources.filter((resource) => childToolIds.includes(resource.toolId))
    removedResources.forEach((resource) => releaseFile(resource.fileReference, objectUrls.current))
    setResources((current) => current.filter((resource) => !childToolIds.includes(resource.toolId)))
    setTools((current) => current.filter((tool) => tool.subcategoryId !== id))
    setSubcategories((current) => current.filter((subcategory) => subcategory.id !== id))
  }

  function addTool(subcategoryId: string, name: string, description: string) {
    const tool = { id: createId('tool'), subcategoryId, name, description }
    setTools((current) => [...current, tool])
    return tool
  }

  function updateTool(id: string, name: string, description: string) {
    setTools((current) => current.map((tool) => tool.id === id ? { ...tool, name, description } : tool))
  }

  function removeTool(id: string) {
    resources.filter((resource) => resource.toolId === id).forEach((resource) => releaseFile(resource.fileReference, objectUrls.current))
    setResources((current) => current.filter((resource) => resource.toolId !== id))
    setTools((current) => current.filter((tool) => tool.id !== id))
  }

  function addResource(toolId: string, draft: TrainingResourceFileDraft): string | null {
    const domain = trainingDomainPresentationData.find((item) => item.id === 'project-tools')
    const tool = tools.find((item) => item.id === toolId)
    if (!domain || !tool || !isTrainingResourceTypeAllowed(domain, draft.type)) {
      return 'This resource type is not allowed for the selected training domain.'
    }
    const fileReference = URL.createObjectURL(draft.file)
    const resource: TrainingResource = {
      id: createId('resource'),
      toolId,
      type: draft.type,
      title: draft.title,
      description: draft.description,
      fileName: draft.file.name,
      fileSizeBytes: draft.file.size,
      mimeType: draft.file.type,
      version: draft.version,
      fileReference,
    }
    objectUrls.current.add(fileReference)
    setResources((current) => [...current, resource])
    return null
  }

  function addDocument(moduleId: string, draft: { title: string; description: string; version: string; file: File }): string | null {
    const domain = trainingDomainPresentationData.find((item) => item.id === moduleId)
    if (!domain || !isTrainingResourceTypeAllowed(domain, 'DOCUMENT')) return 'Document upload is not allowed for the selected training domain.'
    const fileReference = URL.createObjectURL(draft.file)
    objectUrls.current.add(fileReference)
    setDocuments((current) => [...current, { id: createId('document'), moduleId, title: draft.title, description: draft.description, fileName: draft.file.name, fileSizeBytes: draft.file.size, version: draft.version, fileReference }])
    return null
  }

  function replaceDocument(id: string, draft: { title: string; description: string; version: string; file: File }): string | null {
    const document = documents.find((item) => item.id === id)
    const domain = document && trainingDomainPresentationData.find((item) => item.id === document.moduleId)
    if (!document || !domain || !isTrainingResourceTypeAllowed(domain, 'DOCUMENT')) return 'Document upload is not allowed for the selected training domain.'
    const fileReference = URL.createObjectURL(draft.file)
    objectUrls.current.add(fileReference)
    releaseFile(document.fileReference, objectUrls.current)
    setDocuments((current) => current.map((item) => item.id === id ? { ...item, title: draft.title, description: draft.description, fileName: draft.file.name, fileSizeBytes: draft.file.size, version: draft.version, fileReference } : item))
    return null
  }

  function removeDocument(id: string) {
    const document = documents.find((item) => item.id === id)
    if (document) releaseFile(document.fileReference, objectUrls.current)
    setDocuments((current) => current.filter((item) => item.id !== id))
  }

  function replaceResource(id: string, draft: TrainingResourceFileDraft): string | null {
    const resource = resources.find((item) => item.id === id)
    const domain = trainingDomainPresentationData.find((item) => item.id === 'project-tools')
    if (!resource || !domain || resource.type !== draft.type || !isTrainingResourceTypeAllowed(domain, draft.type)) {
      return 'This resource type is not allowed for the selected training domain.'
    }
    const fileReference = URL.createObjectURL(draft.file)
    objectUrls.current.add(fileReference)
    releaseFile(resource.fileReference, objectUrls.current)
    setResources((current) => current.map((item) => item.id === id
      ? {
          ...item,
          title: draft.title,
          description: draft.description,
          fileName: draft.file.name,
          fileSizeBytes: draft.file.size,
          mimeType: draft.file.type,
          version: draft.version,
          fileReference,
        }
      : item))
    return null
  }

  function removeResource(id: string) {
    const resource = resources.find((item) => item.id === id)
    if (resource) releaseFile(resource.fileReference, objectUrls.current)
    setResources((current) => current.filter((item) => item.id !== id))
  }

  return (
    <TrainingPresentationContext.Provider value={{
      subcategories,
      tools,
      resources,
      documents,
      addDocument,
      replaceDocument,
      removeDocument,
      addSubcategory,
      updateSubcategory,
      removeSubcategory,
      addTool,
      updateTool,
      removeTool,
      addResource,
      replaceResource,
      removeResource,
    }}>
      {children}
    </TrainingPresentationContext.Provider>
  )
}

function createId(prefix: string) {
  return `local-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function releaseFile(fileReference: string | undefined, objectUrls: Set<string>) {
  if (!fileReference || !objectUrls.has(fileReference)) return
  URL.revokeObjectURL(fileReference)
  objectUrls.delete(fileReference)
}
