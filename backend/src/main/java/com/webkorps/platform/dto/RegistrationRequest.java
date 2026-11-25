package com.webkorps.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(


        @NotBlank(message = "Full name is required")
        @Size(max = 100)
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Size(max = 150)
        String email,

        @NotBlank(message = "Employee code is required")
        @Size(max = 50)
        String employeeCode,

        @NotBlank(message = "Department is required")
        @Size(max = 100)
        String department,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 72)
        String password

) {
}
