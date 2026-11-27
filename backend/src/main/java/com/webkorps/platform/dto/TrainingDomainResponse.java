package com.webkorps.platform.dto;

import java.time.LocalDateTime;

public record TrainingDomainResponse(
        Long id,
        String name,
        String description,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
