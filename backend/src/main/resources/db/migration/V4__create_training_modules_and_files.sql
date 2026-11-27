CREATE TABLE training_modules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    domain_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(5000),
    status VARCHAR(20) NOT NULL,
    created_by BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at DATETIME NULL,
    CONSTRAINT fk_training_modules_domain
        FOREIGN KEY (domain_id) REFERENCES training_domains(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_training_modules_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_training_modules_status
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    KEY idx_training_modules_browse (status, domain_id, published_at)
) ENGINE=InnoDB;

CREATE TABLE training_module_files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_id BIGINT NOT NULL,
    uploaded_by BIGINT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    storage_key VARCHAR(100) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    sha256 VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    version_note VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_training_module_files_module
        FOREIGN KEY (module_id) REFERENCES training_modules(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_training_module_files_uploaded_by
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uk_training_module_files_storage_key UNIQUE (storage_key),
    CONSTRAINT uk_training_module_files_module_sha256 UNIQUE (module_id, sha256),
    KEY idx_training_module_files_latest (module_id, created_at, id)
) ENGINE=InnoDB;
