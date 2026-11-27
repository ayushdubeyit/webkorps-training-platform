package com.webkorps.platform.controller;

import com.webkorps.platform.common.exception.ApiError;
import com.webkorps.platform.dto.TaskAssignmentRequest;
import com.webkorps.platform.dto.TaskCreateRequest;
import com.webkorps.platform.dto.TaskResponse;
import com.webkorps.platform.dto.TaskUpdateRequest;
import com.webkorps.platform.task.entity.TaskPriority;
import com.webkorps.platform.task.entity.TaskStatus;
import com.webkorps.platform.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/v1/manager/tasks")
public class ManagerTaskController {
    private final TaskService taskService;

    public ManagerTaskController(TaskService taskService) { this.taskService = taskService; }

    @GetMapping
    public Page<TaskResponse> getTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) String search) {
        return taskService.managerTasks(page, size, employeeId, status, priority, search);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody TaskCreateRequest request,
                               org.springframework.security.core.Authentication authentication) {
        return taskService.create(request, authentication.getName());
    }

    @PatchMapping("/{id}")
    public TaskResponse update(@PathVariable Long id, @Valid @RequestBody TaskUpdateRequest request) {
        return taskService.update(id, request);
    }

    @PostMapping("/{id}/assign")
    public TaskResponse assign(@PathVariable Long id, @Valid @RequestBody TaskAssignmentRequest request) {
        return taskService.assign(id, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationFailure(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage()).findFirst().orElse("Request validation failed");
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request", message);
        return ResponseEntity.badRequest().body(error);
    }
}
