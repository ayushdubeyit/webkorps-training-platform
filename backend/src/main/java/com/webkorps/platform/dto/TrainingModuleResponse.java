package com.webkorps.platform.dto;

import com.webkorps.platform.training.module.entity.TrainingModuleStatus;

import java.time.LocalDateTime;

public record TrainingModuleResponse(
        Long id,
        Long domainId,
        String domainName,
        String title,
        String description,
        TrainingModuleStatus status,
        Long createdById,
        String createdByName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime publishedAt
) {
}
