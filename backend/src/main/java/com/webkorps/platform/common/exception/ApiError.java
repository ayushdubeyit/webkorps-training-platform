package com.webkorps.platform.common.exception;

public record ApiError(

        int status,
        String error,
        String message
) {
}
