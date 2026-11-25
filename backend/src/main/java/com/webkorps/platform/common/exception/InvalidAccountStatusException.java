package com.webkorps.platform.common.exception;

public class InvalidAccountStatusException extends RuntimeException{

    public InvalidAccountStatusException(String message) {
        super(message);
    }
}
