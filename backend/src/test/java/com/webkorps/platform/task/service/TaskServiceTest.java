package com.webkorps.platform.task.service;

import com.webkorps.platform.common.exception.InvalidTaskException;
import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.TaskAssignmentRequest;
import com.webkorps.platform.dto.TaskCreateRequest;
import com.webkorps.platform.dto.TaskRemarkRequest;
import com.webkorps.platform.dto.TaskStatusUpdateRequest;
import com.webkorps.platform.dto.TaskUpdateRequest;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.task.entity.Task;
import com.webkorps.platform.task.entity.TaskAssignment;
import com.webkorps.platform.task.entity.TaskPriority;
import com.webkorps.platform.task.entity.TaskStatus;
import com.webkorps.platform.task.repository.TaskAssignmentRepository;
import com.webkorps.platform.task.repository.TaskRemarkRepository;
import com.webkorps.platform.task.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    @Mock TaskRepository taskRepository;
    @Mock TaskAssignmentRepository assignmentRepository;
    @Mock TaskRemarkRepository remarkRepository;
    @Mock UserRepository userRepository;
    @InjectMocks TaskService service;

    @Test
    void createsAndUpdatesManagerTask() {
        User manager = user(1L, "manager@wtp.test", UserRole.MANAGER, AccountStatus.APPROVED);
        when(userRepository.findByEmail(manager.getEmail())).thenReturn(Optional.of(manager));
        when(taskRepository.save(any(Task.class))).thenAnswer(call -> call.getArgument(0));
        var created = service.create(new TaskCreateRequest(" A task ", " details ", TaskPriority.HIGH,
                LocalDate.of(2027, 1, 20)), manager.getEmail());
        assertEquals("A task", created.title());
        assertEquals(TaskPriority.HIGH, created.priority());

        when(taskRepository.findById(5L)).thenReturn(Optional.of(task(5L)));
        var updated = service.update(5L, new TaskUpdateRequest(" Revised ", null, null, null));
        assertEquals("Revised", updated.title());
    }

    @Test
    void assignsOnlyApprovedEmployeeAccountsAndDeactivatesRemovedAssignments() {
        Task task = task(5L);
        TaskAssignment old = assignment(task, user(2L, "old@wtp.test", UserRole.EMPLOYEE, AccountStatus.APPROVED));
        when(taskRepository.findById(5L)).thenReturn(Optional.of(task));
        when(assignmentRepository.findAllByTaskId(5L)).thenReturn(List.of(old));
        when(userRepository.findAllById(any())).thenReturn(List.of(
                user(3L, "new@wtp.test", UserRole.EMPLOYEE, AccountStatus.APPROVED)));
        when(assignmentRepository.saveAll(any())).thenAnswer(call -> call.getArgument(0));
        when(assignmentRepository.findAllByTaskIdAndActiveTrueOrderByIdAsc(5L)).thenAnswer(call -> {
            old.setActive(false);
            TaskAssignment added = assignment(task,
                    user(3L, "new@wtp.test", UserRole.EMPLOYEE, AccountStatus.APPROVED));
            return List.of(added);
        });

        var result = service.assign(5L, new TaskAssignmentRequest(List.of(3L)));
        assertEquals(1, result.assignments().size());
        assertEquals(3L, result.assignments().getFirst().employeeId());
        assertEquals(TaskStatus.TODO, result.assignments().getFirst().status());
        verify(assignmentRepository).saveAll(any());
    }

    @Test
    void rejectsPendingOrManagerAssignmentTargets() {
        when(taskRepository.findById(5L)).thenReturn(Optional.of(task(5L)));
        when(userRepository.findAllById(any())).thenReturn(List.of(
                user(3L, "pending@wtp.test", UserRole.EMPLOYEE, AccountStatus.PENDING)));
        assertThrows(InvalidTaskException.class,
                () -> service.assign(5L, new TaskAssignmentRequest(List.of(3L))));
        verify(assignmentRepository, never()).saveAll(any());
    }

    @Test
    void rejectsUnknownEmployeeAndDuplicateAssignmentIds() {
        when(taskRepository.findById(5L)).thenReturn(Optional.of(task(5L)));
        when(userRepository.findAllById(any())).thenReturn(List.of());
        assertThrows(ResourceNotFoundException.class,
                () -> service.assign(5L, new TaskAssignmentRequest(List.of(3L))));
        assertThrows(InvalidTaskException.class,
                () -> service.assign(5L, new TaskAssignmentRequest(List.of(3L, 3L))));
    }

    @Test
    void employeeCanOnlyReadAndChangeOwnActiveAssignment() {
        when(taskRepository.findById(5L)).thenReturn(Optional.of(task(5L)));
        when(assignmentRepository.findByTaskIdAndEmployeeEmailAndActiveTrue(5L, "other@wtp.test"))
                .thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getTask(5L, "other@wtp.test", false));
        assertThrows(ResourceNotFoundException.class, () -> service.updateStatus(5L,
                new TaskStatusUpdateRequest(TaskStatus.COMPLETED), "other@wtp.test"));
        assertThrows(ResourceNotFoundException.class, () -> service.addRemark(5L,
                new TaskRemarkRequest("private remark"), "other@wtp.test"));

        TaskAssignment own = assignment(task(5L), user(6L, "owner@wtp.test", UserRole.EMPLOYEE,
                AccountStatus.APPROVED));
        when(assignmentRepository.findByTaskIdAndEmployeeEmailAndActiveTrue(5L, "owner@wtp.test"))
                .thenReturn(Optional.of(own));
        when(assignmentRepository.save(any(TaskAssignment.class))).thenAnswer(call -> call.getArgument(0));
        var response = service.updateStatus(5L, new TaskStatusUpdateRequest(TaskStatus.IN_PROGRESS),
                "owner@wtp.test");
        assertEquals(TaskStatus.IN_PROGRESS, response.assignments().getFirst().status());

        when(remarkRepository.save(any())).thenAnswer(call -> call.getArgument(0));
        var remark = service.addRemark(5L, new TaskRemarkRequest("  Working on it  "), "owner@wtp.test");
        assertEquals("Working on it", remark.remark());
        assertEquals(6L, remark.employeeId());
    }

    @Test
    void employeeListAndManagerFiltersUseSeparateQueries() {
        User employee = user(2L, "employee@wtp.test", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        Task task = task(5L);
        TaskAssignment own = assignment(task, employee);
        when(userRepository.findByEmail(employee.getEmail())).thenReturn(Optional.of(employee));
        when(userRepository.findById(2L)).thenReturn(Optional.of(employee));
        when(assignmentRepository.findEmployeeTasks(eq(2L), eq(TaskStatus.TODO), eq(TaskPriority.MEDIUM),
                eq("safety"), any())).thenReturn(new PageImpl<>(List.of(own), PageRequest.of(0, 10), 1));
        assertEquals(1, service.employeeTasks(employee.getEmail(), 0, 10, TaskStatus.TODO,
                TaskPriority.MEDIUM, " safety ").getTotalElements());

        when(taskRepository.searchManagerTasks(eq(2L), eq(TaskStatus.TODO), eq(TaskPriority.MEDIUM),
                eq("safety"), any())).thenReturn(new PageImpl<>(List.of(task)));
        assertEquals(1, service.managerTasks(0, 10, 2L, TaskStatus.TODO,
                TaskPriority.MEDIUM, " safety ").getTotalElements());
    }

    @Test
    void rejectsEmptyUpdateAndInvalidPagination() {
        when(taskRepository.findById(5L)).thenReturn(Optional.of(task(5L)));
        assertThrows(InvalidTaskException.class,
                () -> service.update(5L, new TaskUpdateRequest(null, null, null, null)));
        assertThrows(InvalidTaskException.class,
                () -> service.managerTasks(0, 101, null, null, null, null));
    }

    private Task task(Long id) {
        Task task = new Task();
        task.setId(id);
        task.setTitle("Safety basics");
        task.setDescription("Instructions");
        task.setPriority(TaskPriority.MEDIUM);
        task.setDueDate(LocalDate.of(2027, 1, 20));
        task.setCreatedBy(user(1L, "manager@wtp.test", UserRole.MANAGER, AccountStatus.APPROVED));
        return task;
    }

    private TaskAssignment assignment(Task task, User employee) {
        TaskAssignment assignment = new TaskAssignment();
        assignment.setId(10L);
        assignment.setTask(task);
        assignment.setEmployee(employee);
        assignment.setStatus(TaskStatus.TODO);
        assignment.setActive(true);
        return assignment;
    }

    private User user(Long id, String email, UserRole role, AccountStatus status) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setFullName("Test User");
        user.setRole(role);
        user.setAccountStatus(status);
        return user;
    }
}
