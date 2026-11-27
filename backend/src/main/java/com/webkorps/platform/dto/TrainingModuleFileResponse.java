package com.webkorps.platform.dto;

import java.time.LocalDateTime;

public record TrainingModuleFileResponse(
        Long id,
        String originalFilename,
        String mimeType,
        long sizeBytes,
        String versionNote,
        Long uploadedById,
        String uploadedByName,
        LocalDateTime createdAt
) {
}
