package com.webkorps.platform.dto;

import com.webkorps.platform.task.entity.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TaskAssigneeResponse(Long employeeId, String employeeName, String employeeEmail,
                                   TaskStatus status, LocalDateTime assignedAt,
                                   List<TaskRemarkResponse> remarks) {}
