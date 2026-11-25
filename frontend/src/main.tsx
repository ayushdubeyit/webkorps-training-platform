import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { TrainingPresentationProvider } from './app/providers/TrainingPresentationProvider'
import { TaskAssignmentProvider } from './features/tasks/context/TaskAssignmentProvider'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The application root element was not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <TrainingPresentationProvider>
      <TaskAssignmentProvider>
        <RouterProvider router={router} />
      </TaskAssignmentProvider>
    </TrainingPresentationProvider>
  </StrictMode>,
)
