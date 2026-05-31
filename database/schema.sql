CREATE TABLE organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM(
        'ADMIN',
        'MANAGER',
        'MEMBER'
    ) NOT NULL,
    organization_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
);

CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    priority ENUM(
        'LOW',
        'MEDIUM',
        'HIGH'
    ) NOT NULL,

    status ENUM(
        'TODO',
        'IN_PROGRESS',
        'IN_REVIEW',
        'DONE',
        'BLOCKED'
    ) DEFAULT 'TODO',

    assignee_id INT,
    created_by INT NOT NULL,
    organization_id INT NOT NULL,

    due_date DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (assignee_id)
        REFERENCES users(id),

    FOREIGN KEY (created_by)
        REFERENCES users(id),

    FOREIGN KEY (organization_id)
        REFERENCES organizations(id),

    INDEX idx_tasks_status(status),
    INDEX idx_tasks_assignee(assignee_id),
    INDEX idx_tasks_due_date(due_date),
    INDEX idx_tasks_org_status(
        organization_id,
        status
    )
);

INSERT INTO organizations(name)
VALUES ('Default Organization');