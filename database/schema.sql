CREATE TABLE organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role ENUM(
        'ADMIN',
        'MANAGER',
        'MEMBER'
    ),
    FOREIGN KEY (
        organization_id
    ) REFERENCES organizations(id)
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM(
        'LOW',
        'MEDIUM',
        'HIGH'
    ),
    status ENUM(
        'TODO',
        'IN_PROGRESS',
        'IN_REVIEW',
        'DONE',
        'BLOCKED'
    ),
    assignee_id INT,
    due_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_status(status),
    INDEX idx_assignee(assignee_id),
    INDEX idx_due_date(due_date)
);