# Team Task Tracker API

A RESTful backend API for managing tasks within an organization. The application supports authentication, role-based access control (RBAC), task lifecycle management, Redis caching, and Docker-based deployment.

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Access Tokens
* Refresh Token Rotation
* Role-Based Access Control (RBAC)

Supported Roles:

* ADMIN
* MANAGER
* MEMBER

### Task Management

* Create Tasks
* View Tasks
* View Task Details
* Delete Tasks
* Assign Tasks
* Update Task Status

Supported Status Flow:

TODO → IN_PROGRESS → IN_REVIEW → DONE

BLOCKED can be reached from any active state.

### Task Listing

Supports:

* Pagination
* Status Filtering
* Priority Filtering
* Assignee Filtering

### Caching

Redis caching is implemented for task listing endpoints.

### Containerization

The entire application can be started using Docker Compose.

---

## Tech Stack

* Node.js
* Express.js
* MySQL 8
* Redis 7
* JWT Authentication
* Docker
* Docker Compose

---

## Project Structure

```text
.
├── src
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── middleware
│   ├── routes
│   ├── config
│   └── utils
│
├── database
│   └── schema.sql
│
├── postman
│   └── Team_Task_Tracker.postman_collection.json
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Setup Instructions

### Prerequisites

* Docker
* Docker Compose

### Run Application

```bash
docker compose up --build
```

Application:

```text
http://localhost:3000
```

MySQL:

```text
localhost:3307
```

Redis:

```text
localhost:6379
```

---

## API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| POST   | /api/auth/refresh  |

### Tasks

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/tasks            |
| GET    | /api/tasks            |
| GET    | /api/tasks/:id        |
| PATCH  | /api/tasks/:id/assign |
| PATCH  | /api/tasks/:id/status |
| DELETE | /api/tasks/:id        |

---

## Database Schema

```text
┌─────────────────────┐
│    organizations    │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1:N
           ▼

┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email               │
│ password_hash       │
│ role                │
│ organization_id(FK) │
│ created_at          │
│ updated_at          │
└──────┬────────┬─────┘
       │        │
       │        │ 1:N
       │        ▼
       │
       │   ┌─────────────────────┐
       │   │   refresh_tokens    │
       │   ├─────────────────────┤
       │   │ id (PK)             │
       │   │ user_id (FK)        │
       │   │ token_hash          │
       │   │ expires_at          │
       │   │ created_at          │
       │   └─────────────────────┘
       │
       │ 1:N
       ▼

┌─────────────────────┐
│       tasks         │
├─────────────────────┤
│ id (PK)             │
│ title               │
│ description         │
│ priority            │
│ status              │
│ assignee_id (FK)    │
│ created_by (FK)     │
│ organization_id(FK) │
│ due_date            │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

## Database Design Decision

Tasks are scoped using the `organization_id` column to support multi-tenancy and ensure complete data isolation between organizations.

Indexes were added on:

* status
* assignee_id
* due_date

A composite index on `(organization_id, status)` was also added because task listing queries frequently filter by organization and status together. This improves query performance and reduces full table scans as data volume grows.

---

## Caching Strategy

Task list responses are cached in Redis on a per-assignee basis.

Cache Key Pattern:

```text
tasks:assignee:<assigneeId>
```

### Cache Invalidation

The cache is invalidated whenever:

* A task is created
* A task is deleted
* A task is reassigned
* A task status changes

This ensures users always receive fresh task data while reducing database load.

---

## RBAC Rules

### ADMIN

* Manage users
* Manage tasks
* Manage assignments
* Full access within organization

### MANAGER

* Create tasks
* Assign tasks
* Update task status
* View organization tasks

### MEMBER

* View assigned tasks
* Update status of assigned tasks only

---

## Error Response Format

All API errors follow a consistent structure:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "due_date must be a future date"
}
```

---

## Postman Collection

A Postman collection is included in:

```text
postman/Team_Task_Tracker.postman_collection.json
```

Import the collection into Postman to test all APIs.

---

## Future Improvements

* Add automated unit and integration tests
* Generate Swagger/OpenAPI documentation
* Implement real-time notifications using WebSockets or SSE
* Add audit logging for critical actions
* Add monitoring and observability using metrics and centralized logging
* Introduce background job processing for reminders and notifications
* Add analytics dashboards for task completion and team productivity

---

## Author

Nishika Dogne
