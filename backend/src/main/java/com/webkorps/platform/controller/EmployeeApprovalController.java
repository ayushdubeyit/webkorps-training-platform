package com.webkorps.platform.controller;

import com.webkorps.platform.dto.UserResponse;
import com.webkorps.platform.identity.service.EmployeeApprovalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/manager/employees")
public class EmployeeApprovalController {
    private final EmployeeApprovalService approvalService;

    public EmployeeApprovalController(
            EmployeeApprovalService approvalService) {
        this.approvalService = approvalService;
    }
    @PatchMapping("/{userId}/approve")
    public ResponseEntity<UserResponse> approveEmployee(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                approvalService.approveEmployee(userId)
        );
    }
    @PatchMapping("/{userId}/reject")
    public ResponseEntity<UserResponse> rejectEmployee(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                approvalService.rejectEmployee(userId)
        );
    }



}
