package com.webkorps.platform.identity.service;


import com.webkorps.platform.common.exception.InvalidAccountStatusException;
import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.UserResponse;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class EmployeeApprovalService {

    private final UserRepository userRepository;

    public EmployeeApprovalService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponse approveEmployee(Long userId) {
        return updateStatus(userId, AccountStatus.APPROVED);
    }
    @Transactional
    public UserResponse rejectEmployee(Long userId) {
        return updateStatus(userId, AccountStatus.REJECTED);
    }
    private UserResponse updateStatus(Long userId, AccountStatus newStatus) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + userId
                        ));

        if (user.getRole() != com.webkorps.platform.identity.entity.enums.UserRole.EMPLOYEE) {
            throw new InvalidAccountStatusException(
                    "Only employee accounts can be approved or rejected"
            );
        }

        if (user.getAccountStatus() != AccountStatus.PENDING) {
            throw new InvalidAccountStatusException(
                    "Only pending employee accounts can be updated"
            );
        }

        user.setAccountStatus(newStatus);

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getAccountStatus()
        );
    }


}
