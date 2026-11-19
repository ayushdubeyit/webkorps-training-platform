
-- V1: Create users table
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,

                       full_name VARCHAR(100) NOT NULL,

                       email VARCHAR(150) NOT NULL UNIQUE,

                       password_hash VARCHAR(255) NOT NULL,

                       role VARCHAR(20) NOT NULL,

                       account_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

                       CONSTRAINT chk_users_role
                           CHECK (role IN ('MANAGER', 'EMPLOYEE')),

                       CONSTRAINT chk_users_account_status
                           CHECK (account_status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'))
) ENGINE=InnoDB;


-- V1: Create employee_profiles table
CREATE TABLE employee_profiles (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                   user_id BIGINT NOT NULL UNIQUE,

                                   employee_code VARCHAR(50) UNIQUE,

                                   department VARCHAR(100),

                                   job_title VARCHAR(100),

                                   CONSTRAINT fk_employee_profiles_user
                                       FOREIGN KEY (user_id)
                                           REFERENCES users(id)
                                           ON DELETE RESTRICT
                                           ON UPDATE CASCADE

) ENGINE=InnoDB;
