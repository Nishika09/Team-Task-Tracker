## Database Schema

organizations

* id (PK)
* name

users

* id (PK)
* organization_id (FK → organizations.id)
* name
* email
* password
* role

refresh_tokens

* id (PK)
* user_id (FK → users.id)
* token

tasks

* id (PK)
* organization_id (FK → organizations.id)
* title
* description
* priority
* status
* assignee_id (FK → users.id)
* due_date
* created_at

Indexes:

* status
* assignee_id
* due_date

## Database Design Decision

Indexes were added on status, assignee_id, and due_date because these fields are frequently used in filtering and task retrieval operations.

This reduces full table scans and improves query performance as the number of tasks grows.

## Caching Strategy

Task lists are cached in Redis using keys in the format:

tasks:assignee:<assigneeId>

TTL: 5 minutes

Cache Invalidation:

* Task Creation
* Task Deletion
* Task Status Update
* Task Reassignment

Whenever one of these operations occurs, the relevant cache entries are removed to prevent stale data from being served.

## API Testing

A Postman collection is included in the repository:

postman/Team_Task_Tracker.postman_collection.json

Import the collection into Postman and use the provided requests to test the API.

The collection includes:

* Register
* Login
* Refresh Token
* Create Task
* Get Tasks
* Get Task By Id
* Assign Task
* Update Task Status
* Delete Task


## Database Schema

```text
┌─────────────────────┐
│    organizations    │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ created_at          │
└──────────┬──────────┘
           │ 1:N
           │
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

## Future Improvements

Given more time, I would add the following enhancements:

### 1. Automated Testing

Add comprehensive unit and integration tests for critical flows such as authentication, RBAC authorization, task assignment, and status transitions.

### 2. API Documentation

Generate and maintain OpenAPI (Swagger) documentation to provide interactive API exploration and improve developer onboarding.

### 3. Real-Time Notifications

Implement WebSocket or Server-Sent Events (SSE) to notify users when tasks are assigned to them or when task statuses change.

### 4. Advanced Caching

Introduce selective cache invalidation and cache warming strategies to improve performance for high-traffic task listing endpoints.

### 5. Audit Logging

Track important actions such as task creation, assignment changes, status updates, and user management operations for compliance and troubleshooting.

### 6. Background Job Processing

Use a job queue (e.g., BullMQ) for asynchronous operations such as email notifications, reminders for overdue tasks, and scheduled maintenance tasks.

### 7. Enhanced Security

Implement rate limiting, account lockout policies, refresh token revocation lists, and secret management through a dedicated secrets manager.

### 8. Monitoring and Observability

Add centralized logging, metrics collection, health checks, and distributed tracing to improve production monitoring and debugging.

### 9. Project Management Module

Extend the system to support projects, project-level permissions, milestones, and reporting dashboards.

### 10. Analytics Dashboard

Provide reporting features such as overdue task counts, task completion trends, team productivity metrics, and average task completion time.
