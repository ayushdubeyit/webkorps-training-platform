
package com.webkorps.platform.controller;

import com.webkorps.platform.dto.EmployeeDirectoryResponse;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.service.ManagerEmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/manager/employees")
public class ManagerEmployeeController {

    private final ManagerEmployeeService managerEmployeeService;

    public ManagerEmployeeController(
            ManagerEmployeeService managerEmployeeService) {
        this.managerEmployeeService = managerEmployeeService;
    }

    @GetMapping
    public Page<EmployeeDirectoryResponse> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountStatus status) {

        return managerEmployeeService.getEmployees(
                page, size, search, status
        );
    }

    @GetMapping("/{userId}")
    public EmployeeDirectoryResponse getEmployeeById(
            @PathVariable Long userId) {

        return managerEmployeeService.getEmployeeById(userId);
    }
}
