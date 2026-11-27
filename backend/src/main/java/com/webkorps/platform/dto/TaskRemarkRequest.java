package com.webkorps.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskRemarkRequest(
        @NotBlank(message = "Remark is required")
        @Size(max = 2000, message = "Remark must be at most 2000 characters")
        String remark
) {}
