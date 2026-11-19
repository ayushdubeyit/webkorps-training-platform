# Webkorps Training Platform

A centralized employee training, progress tracking, and task management platform designed to streamline employee learning, training assignments, daily progress reporting, and managerial supervision.

## Project Overview

The Webkorps Training Platform provides a centralized system where managers can manage employee onboarding, publish training resources, assign learning modules, monitor progress, and manage independent tasks.

Employees can access assigned training, explore learning resources, submit daily progress reports, and track their assigned tasks.

The application follows a **Modular Monolith Architecture**, keeping business modules logically separated within a single Spring Boot application.

## Key Features

### 1. Identity & Access Management
- Employee registration and account management.
- Manager approval and rejection of employee registrations.
- Role-based access control (Manager and Employee).
- Secure authentication and authorization.
- Employee profile management.

### 2. Training Management
- Centralized training library.
- Training modules organized by domains.
- Create, update, publish, and archive training modules.
- PDF-based learning resources.
- Assign training modules to individual employees.

### 3. Progress Tracking
- Daily employee progress submissions.
- Training assignment progress monitoring.
- Progress history.
- Challenges, completed activities, and next-day plans.
- Manager visibility into employee progress and missed updates.

### 4. Task Management
- Manager-created independent tasks.
- Employee task assignments.
- Task deadlines and priorities.
- Checklist-style task pointers.
- Task status tracking and history.

### 5. Notifications & Automation
- In-app notifications.
- Email notifications.
- Automated daily progress reminders.
- Missed-update alerts.
- Upcoming and overdue task notifications.

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot |
| Build Tool | Maven |
| REST APIs | Spring Web MVC |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL 8 |
| Database Migrations | Flyway |
| Validation | Jakarta Bean Validation |
| Monitoring | Spring Boot Actuator |
| Boilerplate Reduction | Lombok |
| Security | Spring Security (planned) |
| API Documentation | OpenAPI / Swagger (planned) |
| Frontend | React, TypeScript, Tailwind CSS (planned) |
| Containerization | Docker (planned) |
| CI/CD | Jenkins, GitHub (planned) |
| Cloud | AWS (planned) |

## Architecture

The backend follows a layered architecture within a modular monolith.

```text
Webkorps Training Platform
│
├── Frontend
│   └── React + TypeScript
│
├── Backend
│   └── Spring Boot Application
│       │
│       ├── Identity Module
│       │   ├── Entity
│       │   ├── Repository
│       │   ├── Service
│       │   └── Controller
│       │
│       ├── Training Module
│       ├── Progress Module
│       ├── Task Module
│       ├── Notification Module
│       │
│       └── Common
│           ├── Config
│           ├── Exception
│           └── Response
│
└── Database
    └── MySQL
        └── Flyway Migrations
```

### Backend Request Flow

```text
Client Request
      |
      v
REST Controller
      |
      v
Service Layer
      |
      v
Repository Layer
      |
      v
Spring Data JPA / Hibernate
      |
      v
MySQL Database
```

## Database Management

MySQL is used as the primary relational database.

Flyway manages database schema changes through version-controlled SQL migration files.

Example:

```text
src/main/resources/
└── db/
    └── migration/
        ├── V1__create_users_and_employee_profiles.sql
        ├── V2__create_training_domains.sql
        └── V3__create_training_modules.sql
```

Hibernate is configured with:

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

Flyway manages schema creation and modifications, while Hibernate validates entity mappings.

## Project Setup

### Prerequisites

- Java 21
- Maven
- MySQL 8
- IntelliJ IDEA or another Java IDE
- Git

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd training-platform
```

### 2. Create MySQL database

```sql
CREATE DATABASE webkorps_training
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Create a dedicated application user and grant access to the database.

### 3. Configure application.properties

Create or update:

`src/main/resources/application.properties`

```properties
spring.application.name=training-platform

spring.datasource.url=jdbc:mysql://localhost:3306/webkorps_training
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

server.port=8080

management.endpoints.web.exposure.include=health,info
```

Configure the following environment variables:

```text
DB_USERNAME=training_app
DB_PASSWORD=your_database_password
```

Do not commit actual database credentials to GitHub.

### 4. Run the application

On Windows:

```cmd
mvnw.cmd clean compile
```

Start the application:

```cmd
mvnw.cmd spring-boot:run
```

On Linux/macOS:

```bash
./mvnw clean compile
./mvnw spring-boot:run
```

### 5. Verify application health

Open:

```text
http://localhost:8080/actuator/health
```

Expected response:

```json
{
  "status": "UP"
}
```

## Development Roadmap

The project is being developed incrementally across five major implementation modules.

| Module | Scope | Status |
|---|---|---|
| Module 1 | Foundation, Database & Entity Architecture | In Progress |
| Module 2 | Authentication, Authorization & RBAC | Planned |
| Module 3 | Training Management & Assignments | Planned |
| Module 4 | Progress Tracking & Task Management | Planned |
| Module 5 | Notifications, Automation & Production Deployment | Planned |

### Current Backend Progress

- [x] Spring Boot project initialization
- [x] Maven dependency configuration
- [x] Local MySQL database setup
- [x] Flyway integration
- [x] Initial database migration
- [x] User entity
- [x] EmployeeProfile entity
- [x] User repository
- [x] Employee profile repository
- [x] Initial UserService implementation
- [ ] REST controllers and DTOs
- [ ] Global exception handling
- [ ] Integration testing
- [ ] Remaining business modules

## Future Deployment Architecture

The planned production deployment will use:

- Docker for application containerization.
- Jenkins for automated CI/CD pipelines.
- GitHub for source code management.
- AWS EC2 for application hosting.
- AWS S3 for private training document storage.
- AWS ECR for Docker image management.
- Nginx for reverse proxy and HTTPS.
- CloudWatch for application monitoring.

## Security Considerations

- Passwords will be stored as secure hashes, never plaintext.
- Manager privileges will not be selectable during public registration.
- Protected backend endpoints will enforce authorization.
- Training documents will use private storage.
- Sensitive credentials will be managed through environment variables or secure deployment secrets.
- Important administrative operations will maintain audit history.

## Project Documentation

The detailed product and engineering specifications cover:

- Product requirements and business rules.
- System architecture.
- Database design and relationships.
- REST API specifications.
- Business workflows and automation.
- UI and navigation.
- DevOps and deployment.
- Development roadmap.

## Project Status

**Currently under active development.**

The initial backend foundation and identity module are being implemented using Java, Spring Boot, Spring Data JPA, MySQL, and Flyway.

---

**Built with Java & Spring Boot.**