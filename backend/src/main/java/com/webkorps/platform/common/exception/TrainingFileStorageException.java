package com.webkorps.platform.common.exception;

public class TrainingFileStorageException extends RuntimeException {

    public TrainingFileStorageException(String message) {
        super(message);
    }

    public TrainingFileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}
