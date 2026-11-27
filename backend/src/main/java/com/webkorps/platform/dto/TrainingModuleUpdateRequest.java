package com.webkorps.platform.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record TrainingModuleUpdateRequest(
        @Positive(message = "Domain ID must be positive")
        Long domainId,

        @Size(max = 200, message = "Title must be at most 200 characters")
        String title,

        @Size(max = 5000, message = "Description must be at most 5000 characters")
        String description
) {
}
