import type { TrainingDomain, TrainingResourceType } from '../types/training.types'

export function isTrainingResourceTypeAllowed(domain: TrainingDomain, type: TrainingResourceType): boolean {
  if (type === 'DOCUMENT') return true
  return domain.id === 'project-tools' && domain.supportsVideo
}

export async function validateTrainingResourceFile(
  domain: TrainingDomain,
  type: TrainingResourceType,
  file: File,
): Promise<string | null> {
  if (!isTrainingResourceTypeAllowed(domain, type)) {
    return 'Demo video resources can only be added to Project Tools.'
  }

  const extension = file.name.split('.').pop()?.toLocaleLowerCase()
  const mimeType = file.type.toLocaleLowerCase()
  const acceptedTypes = type === 'VIDEO'
    ? { mp4: 'video/mp4' }
    : {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }

  if (!extension || !(extension in acceptedTypes)) {
    return type === 'VIDEO'
      ? 'Choose an MP4 video file.'
      : 'Choose a PDF, DOC, or DOCX document.'
  }
  const expectedMimeType = acceptedTypes[extension as keyof typeof acceptedTypes]
  if (mimeType !== expectedMimeType) {
    return `The selected file must use the ${expectedMimeType} MIME type.`
  }

  try {
    const signature = new Uint8Array(await file.slice(0, 1024).arrayBuffer())
    const ascii = new TextDecoder('ascii').decode(signature)
    const hasValidSignature = extension === 'pdf'
      ? ascii.includes('%PDF-')
      : extension === 'doc'
        ? signature.slice(0, 8).join(',') === '208,207,17,224,161,177,26,225'
        : extension === 'docx'
          ? signature[0] === 80 && signature[1] === 75 && signature[2] === 3 && signature[3] === 4
          : signature[4] === 102 && signature[5] === 116 && signature[6] === 121 && signature[7] === 112

    if (!hasValidSignature) return 'The selected file does not have a valid file signature for this format.'
  } catch {
    return 'The selected file could not be read. Choose another file.'
  }

  return null
}
