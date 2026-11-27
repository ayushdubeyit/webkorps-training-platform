package com.webkorps.platform.dto;

import java.time.LocalDateTime;

public record TaskRemarkResponse(Long id, Long employeeId, String employeeName,
                                 String remark, LocalDateTime createdAt) {}
