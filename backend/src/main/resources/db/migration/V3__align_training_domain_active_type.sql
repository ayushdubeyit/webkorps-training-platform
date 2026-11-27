ALTER TABLE training_domains
    MODIFY COLUMN active BIT(1) NOT NULL DEFAULT b'1';
