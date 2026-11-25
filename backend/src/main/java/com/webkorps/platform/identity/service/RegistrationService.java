package com.webkorps.platform.identity.service;

import com.webkorps.platform.common.exception.EmailAlreadyExistsException;
import com.webkorps.platform.dto.RegistrationRequest;
import com.webkorps.platform.dto.RegistrationResponse;
import com.webkorps.platform.identity.entity.EmployeeProfile;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.EmployeeProfileRepository;
import com.webkorps.platform.identity.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class RegistrationService {
    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(
            UserRepository userRepository,
            EmployeeProfileRepository employeeProfileRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegistrationResponse registerEmployee(RegistrationRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(
                    "Email is already registered: " + request.email()
            );
        }

        if (employeeProfileRepository.existsByEmployeeCode(request.employeeCode())) {
            throw new IllegalArgumentException(
                    "Employee code is already registered"
            );
        }

        User user = new User();

        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.EMPLOYEE);
        user.setAccountStatus(AccountStatus.PENDING);

        User savedUser = userRepository.save(user);

        EmployeeProfile profile = new EmployeeProfile();

        profile.setUser(savedUser);
        profile.setEmployeeCode(request.employeeCode());
        profile.setDepartment(request.department());

        employeeProfileRepository.save(profile);

        return new RegistrationResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getAccountStatus(),
                "Registration successful. Awaiting manager approval."
        );
    }


}
