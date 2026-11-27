package com.webkorps.platform.task.service;

import com.webkorps.platform.common.exception.InvalidTaskException;
import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.TaskAssigneeResponse;
import com.webkorps.platform.dto.TaskAssignmentRequest;
import com.webkorps.platform.dto.TaskCreateRequest;
import com.webkorps.platform.dto.TaskRemarkRequest;
import com.webkorps.platform.dto.TaskRemarkResponse;
import com.webkorps.platform.dto.TaskResponse;
import com.webkorps.platform.dto.TaskStatusUpdateRequest;
import com.webkorps.platform.dto.TaskUpdateRequest;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.task.entity.Task;
import com.webkorps.platform.task.entity.TaskAssignment;
import com.webkorps.platform.task.entity.TaskPriority;
import com.webkorps.platform.task.entity.TaskRemark;
import com.webkorps.platform.task.entity.TaskStatus;
import com.webkorps.platform.task.repository.TaskAssignmentRepository;
import com.webkorps.platform.task.repository.TaskRemarkRepository;
import com.webkorps.platform.task.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskAssignmentRepository assignmentRepository;
    private final TaskRemarkRepository remarkRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, TaskAssignmentRepository assignmentRepository,
                       TaskRemarkRepository remarkRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.assignmentRepository = assignmentRepository;
        this.remarkRepository = remarkRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TaskResponse create(TaskCreateRequest request, String managerEmail) {
        User manager = findUser(managerEmail);
        Task task = new Task();
        task.setTitle(requireTitle(request.title()));
        task.setDescription(trimToNull(request.description()));
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setCreatedBy(manager);
        return toResponse(taskRepository.save(task), null, true);
    }

    @Transactional
    public TaskResponse update(Long taskId, TaskUpdateRequest request) {
        Task task = findTask(taskId);
        if (request.title() == null && request.description() == null
                && request.priority() == null && request.dueDate() == null) {
            throw new InvalidTaskException("At least one task field must be supplied");
        }
        if (request.title() != null) task.setTitle(requireTitle(request.title()));
        if (request.description() != null) task.setDescription(trimToNull(request.description()));
        if (request.priority() != null) task.setPriority(request.priority());
        if (request.dueDate() != null) task.setDueDate(request.dueDate());
        return toResponse(taskRepository.save(task), null, true);
    }

    @Transactional
    public TaskResponse assign(Long taskId, TaskAssignmentRequest request) {
        Task task = findTask(taskId);
        List<Long> employeeIds = request.employeeIds();
        Set<Long> desiredIds = new HashSet<>(employeeIds);
        if (desiredIds.size() != employeeIds.size()) {
            throw new InvalidTaskException("Employee IDs must not contain duplicates");
        }
        List<User> employees = userRepository.findAllById(desiredIds);
        if (employees.size() != desiredIds.size()) {
            throw new ResourceNotFoundException("One or more employee IDs were not found");
        }
        if (employees.stream().anyMatch(user -> user.getRole() != UserRole.EMPLOYEE
                || user.getAccountStatus() != AccountStatus.APPROVED)) {
            throw new InvalidTaskException("Tasks can only be assigned to approved employees");
        }

        List<TaskAssignment> existing = assignmentRepository.findAllByTaskId(taskId);
        for (TaskAssignment assignment : existing) {
            boolean shouldBeActive = desiredIds.contains(assignment.getEmployee().getId());
            assignment.setActive(shouldBeActive);
        }
        Set<Long> knownIds = new HashSet<>();
        existing.forEach(assignment -> knownIds.add(assignment.getEmployee().getId()));
        for (User employee : employees) {
            if (!knownIds.contains(employee.getId())) {
                TaskAssignment assignment = new TaskAssignment();
                assignment.setTask(task);
                assignment.setEmployee(employee);
                assignment.setStatus(TaskStatus.TODO);
                assignment.setActive(true);
                existing.add(assignment);
            }
        }
        assignmentRepository.saveAll(existing);
        return toResponse(task, null, true);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> employeeTasks(String email, int page, int size, TaskStatus status,
                                            TaskPriority priority, String search) {
        User employee = findUser(email);
        Pageable pageable = pageRequest(page, size, false);
        Page<TaskAssignment> assignments = assignmentRepository.findEmployeeTasks(employee.getId(), status,
                priority, normalizeSearch(search), pageable);
        return assignments.map(assignment -> toResponse(assignment.getTask(), assignment, false));
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> managerTasks(int page, int size, Long employeeId, TaskStatus status,
                                           TaskPriority priority, String search) {
        if (employeeId != null) {
            User employee = userRepository.findById(employeeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));
            if (employee.getRole() != UserRole.EMPLOYEE) {
                throw new InvalidTaskException("Employee filter must refer to an employee account");
            }
        }
        String query = normalizeSearch(search);
        return taskRepository.searchManagerTasks(employeeId, status, priority, query, pageRequest(page, size, true))
                .map(task -> toResponse(task, null, true));
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(Long taskId, String email, boolean manager) {
        Task task = findTask(taskId);
        if (manager) return toResponse(task, null, true);
        TaskAssignment assignment = findAssignment(taskId, email);
        return toResponse(task, assignment, false);
    }

    @Transactional
    public TaskResponse updateStatus(Long taskId, TaskStatusUpdateRequest request, String email) {
        TaskAssignment assignment = findAssignment(taskId, email);
        assignment.setStatus(request.status());
        assignmentRepository.save(assignment);
        return toResponse(assignment.getTask(), assignment, false);
    }

    @Transactional
    public TaskRemarkResponse addRemark(Long taskId, TaskRemarkRequest request, String email) {
        TaskAssignment assignment = findAssignment(taskId, email);
        User employee = assignment.getEmployee();
        TaskRemark remark = new TaskRemark();
        remark.setAssignment(assignment);
        remark.setEmployee(employee);
        remark.setRemark(request.remark().trim());
        TaskRemark saved = remarkRepository.save(remark);
        return toRemarkResponse(saved);
    }

    private Task findTask(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
    }

    private TaskAssignment findAssignment(Long taskId, String email) {
        return assignmentRepository.findByTaskIdAndEmployeeEmailAndActiveTrue(taskId, email)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User account was not found"));
    }

    private Pageable pageRequest(int page, int size, boolean sort) {
        if (page < 0) throw new InvalidTaskException("Page number cannot be negative");
        if (size < 1 || size > 100) throw new InvalidTaskException("Page size must be between 1 and 100");
        return sort ? PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id")))
                : PageRequest.of(page, size);
    }

    private String normalizeSearch(String search) {
        if (search == null || search.isBlank()) return null;
        String normalized = search.trim();
        if (normalized.length() > 200) throw new InvalidTaskException("Search text must be at most 200 characters");
        return normalized;
    }

    private String requireTitle(String title) {
        String normalized = title == null ? "" : title.trim();
        if (normalized.isBlank()) throw new InvalidTaskException("Title must not be blank");
        if (normalized.length() > 200) throw new InvalidTaskException("Title must be at most 200 characters");
        return normalized;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private TaskResponse toResponse(Task task, TaskAssignment ownAssignment, boolean includeAllAssignments) {
        List<TaskAssignment> assignments;
        if (includeAllAssignments) {
            assignments = assignmentRepository.findAllByTaskIdAndActiveTrueOrderByIdAsc(task.getId());
        } else {
            assignments = ownAssignment == null ? List.of() : List.of(ownAssignment);
        }
        List<TaskAssigneeResponse> assignees = new ArrayList<>();
        for (TaskAssignment assignment : assignments) {
            List<TaskRemarkResponse> remarks = remarkRepository
                    .findAllByAssignmentIdOrderByCreatedAtAscIdAsc(assignment.getId()).stream()
                    .map(this::toRemarkResponse).toList();
            User employee = assignment.getEmployee();
            assignees.add(new TaskAssigneeResponse(employee.getId(), employee.getFullName(), employee.getEmail(),
                    assignment.getStatus(), assignment.getAssignedAt(), remarks));
        }
        return new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getPriority(),
                task.getDueDate(), task.getCreatedBy().getId(), task.getCreatedBy().getFullName(),
                task.getCreatedAt(), task.getUpdatedAt(), assignees);
    }

    private TaskRemarkResponse toRemarkResponse(TaskRemark remark) {
        return new TaskRemarkResponse(remark.getId(), remark.getEmployee().getId(),
                remark.getEmployee().getFullName(), remark.getRemark(), remark.getCreatedAt());
    }
}
