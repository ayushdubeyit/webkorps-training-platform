import { createBrowserRouter } from 'react-router-dom'
import { EmployeeLayout } from '../layouts/EmployeeLayout'
import { ManagerLayout } from '../layouts/ManagerLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { HomePage } from '../../features/home/HomePage'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterPage } from '../../features/auth/pages/RegisterPage'
import { RegistrationPendingPage } from '../../features/auth/pages/RegistrationPendingPage'
import { EmployeeApprovalsPage } from '../../features/manager/approvals/pages/EmployeeApprovalsPage'
import { ManagerDashboardPage } from '../../features/manager/dashboard/pages/ManagerDashboardPage'
import { ManagerProfilePage } from '../../features/manager/employees/pages/ManagerProfilePage'
import { EmployeeDirectoryPage } from '../../features/manager/employees/pages/EmployeeDirectoryPage'
import { EmployeeProfilePage } from '../../features/manager/employees/pages/EmployeeProfilePage'
import { EmployeeDashboardPage } from '../../features/employee/dashboard/pages/EmployeeDashboardPage'
import { TrainingModulesPage } from '../../features/employee/training/pages/TrainingModulesPage'
import { TrainingModuleDetailsPage } from '../../features/employee/training/pages/TrainingModuleDetailsPage'
import { TrainingManagementPage } from '../../features/manager/training/pages/TrainingManagementPage'
import { TrainingManagementLibraryPage } from '../../features/manager/training/pages/TrainingManagementLibraryPage'
import { TrainingModuleManagementPage } from '../../features/manager/training/pages/TrainingModuleManagementPage'
import { ProjectToolManagementDetailsPage } from '../../features/manager/training/pages/ProjectToolManagementDetailsPage'
import { ManagerSettingsPage } from '../../features/manager/settings/pages/ManagerSettingsPage'
import { ProjectToolsManagementPanel } from '../../features/manager/training/components/ProjectToolsManagementPanel'
import { ProjectToolDetailsPage, ProjectToolsPage } from '../../features/employee/training/pages/ProjectToolsPages'
import { AssignEmployeeTaskPage } from '../../features/manager/employees/pages/AssignEmployeeTaskPage'
import { EmployeeMyTasksPage } from '../../features/employee/tasks/pages/EmployeeMyTasksPage'
import { EmployeeProfilePage as EmployeePortalProfilePage } from '../../features/employee/profile/EmployeeProfilePage'
import { EmployeeTrackerPage } from '../../features/employee/tracker/EmployeeTrackerPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/registration-pending', element: <RegistrationPendingPage /> },
  {
    path: '/manager',
    element: <ManagerLayout />,
    children: [
      { index: true, element: <ManagerDashboardPage /> },
      { path: 'profile', element: <ManagerProfilePage /> },
      { path: 'settings', element: <ManagerSettingsPage /> },
      { path: 'employees', element: <EmployeeDirectoryPage /> },
      { path: 'employees/:employeeId', element: <EmployeeProfilePage /> },
      { path: 'employees/:employeeId/assign-task', element: <AssignEmployeeTaskPage /> },
      { path: 'approvals', element: <EmployeeApprovalsPage /> },
      {
        path: 'training',
        element: <TrainingManagementPage />,
        children: [
          { index: true, element: <TrainingManagementLibraryPage /> },
          { path: 'project-tools', element: <ProjectToolsManagementPanel /> },
          { path: 'project-tools/:subcategoryId/:toolId', element: <ProjectToolManagementDetailsPage /> },
          { path: ':moduleId', element: <TrainingModuleManagementPage /> },
        ],
      },
    ],
  },
  {
    path: '/employee',
    element: <EmployeeLayout />,
    children: [
      { index: true, element: <EmployeeDashboardPage /> },
      { path: 'profile', element: <EmployeePortalProfilePage /> },
      { path: 'tracker', element: <EmployeeTrackerPage /> },
      { path: 'my-tasks', element: <EmployeeMyTasksPage /> },
      { path: 'training', element: <TrainingModulesPage /> },
      { path: 'training/project-tools', element: <ProjectToolsPage /> },
      { path: 'training/project-tools/:subcategoryId/:toolId', element: <ProjectToolDetailsPage /> },
      { path: 'training/project-tools/:subcategoryId/:toolId/resources/:resourceId', element: <ProjectToolDetailsPage /> },
      { path: 'training/:moduleId', element: <TrainingModuleDetailsPage /> },
      { path: 'training/:moduleId/documents/:documentId', element: <TrainingModuleDetailsPage /> },
    ],
  },
])
