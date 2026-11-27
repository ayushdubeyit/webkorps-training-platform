package com.webkorps.platform.common.exception;

public class DomainNameAlreadyExistsException extends RuntimeException {

    public DomainNameAlreadyExistsException(String name) {
        super("A training domain named '" + name + "' already exists");
    }
}
