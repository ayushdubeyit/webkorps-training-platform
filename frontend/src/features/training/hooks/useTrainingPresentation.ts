import { useContext } from 'react'
import { TrainingPresentationContext } from '../context/trainingPresentationContext'

export function useTrainingPresentation() {
  const context = useContext(TrainingPresentationContext)
  if (!context) throw new Error('useTrainingPresentation must be used inside TrainingPresentationProvider.')
  return context
}
