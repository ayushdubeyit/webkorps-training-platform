package com.webkorps.platform.dto;

import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;

public record UserResponse(

        Long id,
        String fullName,
        String email,
        UserRole role,
        AccountStatus accountStatus


)

