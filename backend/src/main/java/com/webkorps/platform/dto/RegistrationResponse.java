package com.webkorps.platform.dto;


import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;

public record RegistrationResponse(

        Long userId,
        String fullName,
        String email,
        UserRole role,
        AccountStatus accountStatus,
        String message

) {
}
