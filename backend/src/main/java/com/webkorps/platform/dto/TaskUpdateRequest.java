package com.webkorps.platform.dto;

import com.webkorps.platform.task.entity.TaskPriority;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskUpdateRequest(
        @Size(max = 200, message = "Title must be at most 200 characters") String title,
        @Size(max = 5000, message = "Description must be at most 5000 characters") String description,
        TaskPriority priority,
        LocalDate dueDate
) {}
