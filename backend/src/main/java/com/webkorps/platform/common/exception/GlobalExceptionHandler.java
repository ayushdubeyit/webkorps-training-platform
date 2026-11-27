package com.webkorps.platform.common.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(
            ResourceNotFoundException ex) {

        ApiError error = new ApiError(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleEmailAlreadyExists(
            EmailAlreadyExistsException ex) {

        ApiError error = new ApiError(
                HttpStatus.CONFLICT.value(),
                "Conflict",
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(DomainNameAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleDomainNameAlreadyExists(
            DomainNameAlreadyExistsException ex) {
        ApiError error = new ApiError(HttpStatus.CONFLICT.value(), "Conflict", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(InvalidTrainingDomainException.class)
    public ResponseEntity<ApiError> handleInvalidTrainingDomain(
            InvalidTrainingDomainException ex) {
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(InvalidTrainingModuleException.class)
    public ResponseEntity<ApiError> handleInvalidTrainingModule(
            InvalidTrainingModuleException ex) {
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(InvalidTrainingFileException.class)
    public ResponseEntity<ApiError> handleInvalidTrainingFile(
            InvalidTrainingFileException ex) {
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(DuplicateTrainingModuleFileException.class)
    public ResponseEntity<ApiError> handleDuplicateTrainingModuleFile(
            DuplicateTrainingModuleFileException ex) {
        ApiError error = new ApiError(HttpStatus.CONFLICT.value(), "Conflict", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler({TrainingFileTooLargeException.class, MaxUploadSizeExceededException.class})
    public ResponseEntity<ApiError> handleTrainingFileTooLarge(Exception ex) {
        ApiError error = new ApiError(HttpStatus.PAYLOAD_TOO_LARGE.value(), "Payload Too Large",
                "PDF exceeds the configured maximum file size");
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(error);
    }

    @ExceptionHandler(TrainingFileStorageException.class)
    public ResponseEntity<ApiError> handleTrainingFileStorageFailure(
            TrainingFileStorageException ex) {
        ApiError error = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
                "Training file storage is unavailable");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

}
