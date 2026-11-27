package com.webkorps.platform.dto;

import com.webkorps.platform.task.entity.TaskPriority;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TaskResponse(Long id, String title, String description, TaskPriority priority,
                           LocalDate dueDate, Long createdById, String createdByName,
                           LocalDateTime createdAt, LocalDateTime updatedAt,
                           List<TaskAssigneeResponse> assignments) {}
