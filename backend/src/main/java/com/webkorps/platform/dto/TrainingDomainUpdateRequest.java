package com.webkorps.platform.dto;

import jakarta.validation.constraints.Size;

public record TrainingDomainUpdateRequest(
        String name,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description
) {
}
