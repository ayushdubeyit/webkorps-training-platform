
package com.webkorps.platform.identity.service;

import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.EmployeeDirectoryResponse;
import com.webkorps.platform.identity.entity.EmployeeProfile;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.EmployeeProfileRepository;
import com.webkorps.platform.identity.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ManagerEmployeeService {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository employeeProfileRepository;

    public ManagerEmployeeService(
            UserRepository userRepository,
            EmployeeProfileRepository employeeProfileRepository) {
        this.userRepository = userRepository;
        this.employeeProfileRepository = employeeProfileRepository;
    }

    public Page<EmployeeDirectoryResponse> getEmployees(
            int page,
            int size,
            String search,
            AccountStatus status) {

        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException("Page size must be between 1 and 100");
        }

        String normalizedSearch =
                (search == null || search.isBlank()) ? null : search.trim();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return userRepository.findEmployeeDirectory(
                UserRole.EMPLOYEE,
                normalizedSearch,
                status,
                pageable
        );
    }

    public EmployeeDirectoryResponse getEmployeeById(Long userId) {

        User user = userRepository.findById(userId)
                .filter(u -> u.getRole() == UserRole.EMPLOYEE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with ID: " + userId
                        )
                );

        EmployeeProfile profile = employeeProfileRepository
                .findByUserId(userId)
                .orElse(null);

        return new EmployeeDirectoryResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus(),
                profile != null ? profile.getEmployeeCode() : null,
                profile != null ? profile.getDepartment() : null,
                profile != null ? profile.getJobTitle() : null,
                user.getCreatedAt()
        );
    }
}
