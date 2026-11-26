package com.webkorps.platform.dto;

import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;

import java.time.LocalDateTime;

public record EmployeeDirectoryResponse(


        Long userId,
        String fullName,
        String email,
        UserRole role,
        AccountStatus accountStatus,
        String employeeCode,
        String department,
        String jobTitle,
        LocalDateTime createdAt


) {
}
