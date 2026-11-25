import type { TrainingDocument, TrainingDomain, TrainingModule } from '../types/training.types'

/** The initial technology catalog is presentation data, not a fixed product enum. */
export const trainingModulePresentationData: TrainingModule[] = [
  { id: 'java-developer', name: 'Java Developer', description: 'Build a strong foundation in Java and modern backend development.', category: 'Software Development' },
  { id: 'python-developer', name: 'Python Developer', description: 'Learn Python fundamentals and popular web development frameworks.', category: 'Software Development' },
  { id: 'data-engineering', name: 'Data Engineering', description: 'Explore data pipelines, storage, and processing foundations.', category: 'Data' },
  { id: 'ai-ml', name: 'AI / ML', description: 'An introduction to machine learning concepts and applied AI.', category: 'Artificial Intelligence' },
  { id: 'mern-stack', name: 'MERN Stack', description: 'Develop full stack applications with MongoDB, Express, React, and Node.js.', category: 'Web Development' },
  { id: 'cyber-security', name: 'Cyber Security', description: 'Study practical security principles for modern systems.', category: 'Security' },
  { id: 'servicenow', name: 'ServiceNow', description: 'Learn the ServiceNow platform and workflow fundamentals.', category: 'Enterprise Platforms' },
  { id: 'salesforce', name: 'Salesforce', description: 'Explore Salesforce platform concepts and CRM configuration.', category: 'CRM' },
]

/** Domain display metadata, including the separate nested Project Tools domain. */
export const trainingDomainPresentationData: TrainingDomain[] = [
  ...trainingModulePresentationData.map((module) => ({
    id: module.id,
    name: module.name,
    description: module.description,
    supportsVideo: false,
  })),
  {
    id: 'project-tools',
    name: 'Project Tools',
    description: 'Explore everyday tools for communication, project work, collaboration, development, and remote access.',
    supportsVideo: true,
  },
]

/** Fictional document metadata only; none of these records contains a PDF file URL. */
export const trainingDocumentPresentationData: TrainingDocument[] = [
  { id: 'java-core', moduleId: 'java-developer', title: 'Core Java', description: 'Language syntax, object-oriented principles, and collections.', fileName: 'Core Java.pdf', fileSizeBytes: 1_835_008, version: '1.0' },
  { id: 'java-advanced', moduleId: 'java-developer', title: 'Advanced Java', description: 'Concurrency, JVM fundamentals, and application patterns.', fileName: 'Advanced Java.pdf', fileSizeBytes: 2_490_368, version: '1.2' },
  { id: 'java-spring', moduleId: 'java-developer', title: 'Spring Boot', description: 'Build and configure services with Spring Boot.', fileName: 'Spring Boot.pdf', fileSizeBytes: 3_014_656, version: '1.0' },
  { id: 'java-microservices', moduleId: 'java-developer', title: 'Microservices', description: 'Service boundaries, communication, and deployment concepts.', fileName: 'Microservices.pdf', fileSizeBytes: 2_621_440, version: '1.0' },
  { id: 'python-basics', moduleId: 'python-developer', title: 'Python Basics', description: 'Core syntax, data structures, and functions.', fileName: 'Python Basics.pdf', fileSizeBytes: 1_310_720, version: '1.0' },
  { id: 'python-django', moduleId: 'python-developer', title: 'Django', description: 'Web application structure and Django fundamentals.', fileName: 'Django.pdf', fileSizeBytes: 2_097_152, version: '1.0' },
  { id: 'python-fastapi', moduleId: 'python-developer', title: 'FastAPI', description: 'Create APIs using Python type hints and FastAPI.', fileName: 'FastAPI.pdf', fileSizeBytes: 1_572_864, version: '1.1' },
  { id: 'data-pipelines', moduleId: 'data-engineering', title: 'Data Pipeline Fundamentals', description: 'Batch processing, orchestration, and data quality.', fileName: 'Data Pipeline Fundamentals.pdf', fileSizeBytes: 2_883_584, version: '1.0' },
  { id: 'ai-ml-foundations', moduleId: 'ai-ml', title: 'Machine Learning Foundations', description: 'Core terminology, model training, and evaluation.', fileName: 'Machine Learning Foundations.pdf', fileSizeBytes: 3_407_872, version: '1.0' },
  { id: 'mern-overview', moduleId: 'mern-stack', title: 'MERN Stack Overview', description: 'Understand how the stack components work together.', fileName: 'MERN Stack Overview.pdf', fileSizeBytes: 2_228_224, version: '1.0' },
  { id: 'security-basics', moduleId: 'cyber-security', title: 'Security Fundamentals', description: 'Threat awareness and foundational security practices.', fileName: 'Security Fundamentals.pdf', fileSizeBytes: 1_966_080, version: '1.0' },
  { id: 'servicenow-fundamentals', moduleId: 'servicenow', title: 'ServiceNow Fundamentals', description: 'Platform navigation, records, and workflow concepts.', fileName: 'ServiceNow Fundamentals.pdf', fileSizeBytes: 2_424_832, version: '1.0' },
  { id: 'salesforce-foundations', moduleId: 'salesforce', title: 'Salesforce Foundations', description: 'CRM objects, records, and platform basics.', fileName: 'Salesforce Foundations.pdf', fileSizeBytes: 2_031_616, version: '1.0' },
]
