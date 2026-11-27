CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(5000),
    priority VARCHAR(20) NOT NULL,
    due_date DATE NOT NULL,
    created_by BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_created_by FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_tasks_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    KEY idx_tasks_due_date (due_date),
    KEY idx_tasks_priority (priority)
) ENGINE=InnoDB;

CREATE TABLE task_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_assignments_task FOREIGN KEY (task_id) REFERENCES tasks(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_task_assignments_employee FOREIGN KEY (employee_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uk_task_assignments_task_employee UNIQUE (task_id, employee_id),
    CONSTRAINT chk_task_assignments_status CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    KEY idx_task_assignments_employee_active (employee_id, active, status),
    KEY idx_task_assignments_task_active (task_id, active)
) ENGINE=InnoDB;

CREATE TABLE task_remarks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    remark VARCHAR(2000) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_remarks_assignment FOREIGN KEY (assignment_id) REFERENCES task_assignments(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_task_remarks_employee FOREIGN KEY (employee_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    KEY idx_task_remarks_assignment_created (assignment_id, created_at)
) ENGINE=InnoDB;
