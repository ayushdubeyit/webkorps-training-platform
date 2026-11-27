package com.webkorps.platform.controller;

import com.webkorps.platform.common.exception.ApiError;
import com.webkorps.platform.dto.TaskRemarkRequest;
import com.webkorps.platform.dto.TaskRemarkResponse;
import com.webkorps.platform.dto.TaskResponse;
import com.webkorps.platform.dto.TaskStatusUpdateRequest;
import com.webkorps.platform.task.entity.TaskPriority;
import com.webkorps.platform.task.entity.TaskStatus;
import com.webkorps.platform.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) { this.taskService = taskService; }

    @GetMapping("/tasks")
    public Page<TaskResponse> getMyTasks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) String search) {
        return taskService.employeeTasks(authentication.getName(), page, size, status, priority, search);
    }

    @GetMapping("/tasks/{id}")
    public TaskResponse getTask(@PathVariable Long id, Authentication authentication) {
        return taskService.getTask(id, authentication.getName(), isManager(authentication));
    }

    @PatchMapping("/tasks/{id}/status")
    public TaskResponse updateStatus(@PathVariable Long id, @Valid @RequestBody TaskStatusUpdateRequest request,
                                     Authentication authentication) {
        return taskService.updateStatus(id, request, authentication.getName());
    }

    @PostMapping("/tasks/{id}/remarks")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskRemarkResponse addRemark(@PathVariable Long id, @Valid @RequestBody TaskRemarkRequest request,
                                        Authentication authentication) {
        return taskService.addRemark(id, request, authentication.getName());
    }

    private boolean isManager(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_MANAGER".equals(authority.getAuthority()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationFailure(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage()).findFirst().orElse("Request validation failed");
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request", message);
        return ResponseEntity.badRequest().body(error);
    }
}
