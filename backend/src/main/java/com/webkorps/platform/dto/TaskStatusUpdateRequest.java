package com.webkorps.platform.dto;

import com.webkorps.platform.task.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record TaskStatusUpdateRequest(@NotNull(message = "Status is required") TaskStatus status) {}
