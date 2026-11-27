package com.webkorps.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TrainingDomainCreateRequest(
        @NotBlank(message = "Name is required")
        String name,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description
) {
}
