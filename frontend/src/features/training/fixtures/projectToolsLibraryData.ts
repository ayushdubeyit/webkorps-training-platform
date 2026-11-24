import type { TrainingResource, TrainingSubcategory, TrainingTool } from '../types/training.types'

/** Fictional folder and tool catalog records for the Project Tools preview. */
export const projectToolsSubcategoryPresentationData: TrainingSubcategory[] = [
  { id: 'communication-meetings', domainId: 'project-tools', name: 'Communication & Meetings', description: 'Team messaging, email, and video meeting tools.' },
  { id: 'project-management', domainId: 'project-tools', name: 'Project Management', description: 'Plan work, track tasks, and coordinate projects.' },
  { id: 'documentation-collaboration', domainId: 'project-tools', name: 'Documentation & Collaboration', description: 'Shared workspaces, documents, and knowledge bases.' },
  { id: 'development-tools', domainId: 'project-tools', name: 'Development Tools', description: 'Source control and software delivery platforms.' },
  { id: 'remote-access', domainId: 'project-tools', name: 'Remote Access', description: 'Tools for secure remote support and access.' },
]

export const projectToolsToolPresentationData: TrainingTool[] = [
  { id: 'microsoft-teams', subcategoryId: 'communication-meetings', name: 'Microsoft Teams', description: 'Messaging, meetings, and team collaboration.' },
  { id: 'microsoft-outlook', subcategoryId: 'communication-meetings', name: 'Microsoft Outlook', description: 'Email, calendars, and meeting coordination.' },
  { id: 'slack', subcategoryId: 'communication-meetings', name: 'Slack', description: 'Channels and direct messaging for teams.' },
  { id: 'zoom', subcategoryId: 'communication-meetings', name: 'Zoom', description: 'Video meetings and collaboration.' },
  { id: 'google-meet', subcategoryId: 'communication-meetings', name: 'Google Meet', description: 'Browser-based video meetings.' },
  { id: 'jira', subcategoryId: 'project-management', name: 'Jira', description: 'Plan, track, and deliver project work.' },
  { id: 'trello', subcategoryId: 'project-management', name: 'Trello', description: 'Organize project work with visual boards.' },
  { id: 'asana', subcategoryId: 'project-management', name: 'Asana', description: 'Coordinate projects, tasks, and team goals.' },
  { id: 'microsoft-planner', subcategoryId: 'project-management', name: 'Microsoft Planner', description: 'Organize team tasks and project plans.' },
  { id: 'confluence', subcategoryId: 'documentation-collaboration', name: 'Confluence', description: 'Create and share team knowledge.' },
  { id: 'sharepoint', subcategoryId: 'documentation-collaboration', name: 'SharePoint', description: 'Collaborate on files and team sites.' },
  { id: 'google-drive', subcategoryId: 'documentation-collaboration', name: 'Google Drive', description: 'Store, organize, and collaborate on files.' },
  { id: 'github', subcategoryId: 'development-tools', name: 'GitHub', description: 'Collaborate on code and software projects.' },
  { id: 'gitlab', subcategoryId: 'development-tools', name: 'GitLab', description: 'Manage source control and software delivery.' },
  { id: 'azure-devops', subcategoryId: 'development-tools', name: 'Azure DevOps', description: 'Plan, build, and deliver software.' },
  { id: 'teamviewer', subcategoryId: 'remote-access', name: 'TeamViewer', description: 'Remote access and support workflows.' },
  { id: 'anydesk', subcategoryId: 'remote-access', name: 'AnyDesk', description: 'Remote desktop access and support.' },
  { id: 'remotepc', subcategoryId: 'remote-access', name: 'RemotePC', description: 'Remote access to work computers.' },
  { id: 'remote-captain', subcategoryId: 'remote-access', name: 'Remote Captain', description: 'Remote access and assistance workflows.' },
]

/** Metadata-only resource examples; no URLs or real file contents are supplied. */
export const projectToolsResourcePresentationData: TrainingResource[] = [
  { id: 'jira-guide', toolId: 'jira', type: 'DOCUMENT', title: 'Jira Project Basics', description: 'An introduction to projects, issues, and boards.', fileName: 'Jira Project Basics.pdf', fileSizeBytes: 1_835_008, mimeType: 'application/pdf', version: '1.0' },
  { id: 'jira-workflow', toolId: 'jira', type: 'DOCUMENT', title: 'Workflow Reference', description: 'A sample editable document resource.', fileName: 'Workflow Reference.docx', fileSizeBytes: 458_752, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', version: '1.0' },
  { id: 'jira-demo', toolId: 'jira', type: 'VIDEO', title: 'Jira Sprint Planning Demo', description: 'A sample demonstration video resource.', fileName: 'Jira Sprint Planning Demo.mp4', fileSizeBytes: 18_874_368, mimeType: 'video/mp4' },
  { id: 'slack-guide', toolId: 'slack', type: 'DOCUMENT', title: 'Slack Essentials', description: 'Channels, messages, and team workflows.', fileName: 'Slack Essentials.pdf', fileSizeBytes: 1_048_576, mimeType: 'application/pdf', version: '1.0' },
  { id: 'teams-demo', toolId: 'microsoft-teams', type: 'VIDEO', title: 'Teams Meetings Demo', description: 'A sample demonstration video resource.', fileName: 'Teams Meetings Demo.mp4', fileSizeBytes: 16_777_216, mimeType: 'video/mp4' },
]
