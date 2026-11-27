package com.webkorps.platform.common.exception;

public class DuplicateTrainingModuleFileException extends RuntimeException {

    public DuplicateTrainingModuleFileException() {
        super("This PDF has already been uploaded to the training module");
    }
}
