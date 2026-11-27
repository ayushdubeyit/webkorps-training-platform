package com.webkorps.platform.dto;

import com.webkorps.platform.task.entity.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskCreateRequest(
        @NotBlank(message = "Title is required") @Size(max = 200, message = "Title must be at most 200 characters")
        String title,
        @Size(max = 5000, message = "Description must be at most 5000 characters") String description,
        @NotNull(message = "Priority is required") TaskPriority priority,
        @NotNull(message = "Due date is required") LocalDate dueDate
) {}
