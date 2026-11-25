package com.webkorps.platform.dto;

import com.webkorps.platform.identity.entity.enums.UserRole;

public record LoginResponse (
        String accessToken,
        String tokenType,
        Long userId,
        String email,
        UserRole role
)

{}
