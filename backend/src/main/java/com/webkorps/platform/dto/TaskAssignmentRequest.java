package com.webkorps.platform.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TaskAssignmentRequest(
        @NotEmpty(message = "At least one employee ID is required")
        List<@NotNull(message = "Employee IDs must not be null") Long> employeeIds
) {}
