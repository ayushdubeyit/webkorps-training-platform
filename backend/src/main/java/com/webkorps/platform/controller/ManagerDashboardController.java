
package com.webkorps.platform.controller;

import com.webkorps.platform.dto.EmployeeDirectoryResponse;
import com.webkorps.platform.dto.ManagerDashboardSummary;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.service.ManagerDashboardService;
import com.webkorps.platform.identity.service.ManagerEmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/manager/dashboard")
public class ManagerDashboardController {

    private final ManagerDashboardService managerDashboardService;
    private final ManagerEmployeeService managerEmployeeService;

    public ManagerDashboardController(
            ManagerDashboardService managerDashboardService,
            ManagerEmployeeService managerEmployeeService
    ) {
        this.managerDashboardService = managerDashboardService;
        this.managerEmployeeService = managerEmployeeService;
    }

    @GetMapping("/summary")
    public ManagerDashboardSummary getDashboardSummary() {
        return managerDashboardService.getDashboardSummary();
    }

    @GetMapping("/pending-approvals")
    public Page<EmployeeDirectoryResponse> getPendingApprovals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return managerEmployeeService.getEmployees(
                page,
                size,
                null,
                AccountStatus.PENDING
        );
    }
}
