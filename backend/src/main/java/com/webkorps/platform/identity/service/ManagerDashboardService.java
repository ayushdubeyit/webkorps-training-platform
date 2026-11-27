
package com.webkorps.platform.identity.service;

import com.webkorps.platform.dto.ManagerDashboardSummary;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ManagerDashboardService {

    private final UserRepository userRepository;

    public ManagerDashboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ManagerDashboardSummary getDashboardSummary() {

        long totalApprovedEmployees =
                userRepository.countByRoleAndAccountStatus(
                        UserRole.EMPLOYEE,
                        AccountStatus.APPROVED
                );

        long pendingApprovals =
                userRepository.countByRoleAndAccountStatus(
                        UserRole.EMPLOYEE,
                        AccountStatus.PENDING
                );

        return new ManagerDashboardSummary(
                totalApprovedEmployees,
                pendingApprovals
        );
    }
}
