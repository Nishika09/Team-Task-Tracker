Database Design Decision

Indexes were added on:

- status
- assignee_id
- due_date

These fields are frequently used for filtering and task list retrieval. Indexing them reduces scan time and improves query performance as task volume grows.