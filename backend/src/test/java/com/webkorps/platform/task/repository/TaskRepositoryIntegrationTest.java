package com.webkorps.platform.task.repository;

import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.task.entity.Task;
import com.webkorps.platform.task.entity.TaskAssignment;
import com.webkorps.platform.task.entity.TaskPriority;
import com.webkorps.platform.task.entity.TaskStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("training-domain-test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TaskRepositoryIntegrationTest {
    @Autowired UserRepository userRepository;
    @Autowired TaskRepository taskRepository;
    @Autowired TaskAssignmentRepository assignmentRepository;

    @Test
    void persistsTaskAssignmentsAndQueriesOwnershipAndFilters() {
        User manager = user("task-manager@test.local", UserRole.MANAGER);
        User employee = user("task-employee@test.local", UserRole.EMPLOYEE);
        userRepository.save(manager);
        userRepository.save(employee);

        Task task = new Task();
        task.setTitle("Safety checklist");
        task.setDescription("Review workplace safety");
        task.setPriority(TaskPriority.URGENT);
        task.setDueDate(LocalDate.of(2027, 1, 20));
        task.setCreatedBy(manager);
        task = taskRepository.saveAndFlush(task);

        TaskAssignment assignment = new TaskAssignment();
        assignment.setTask(task);
        assignment.setEmployee(employee);
        assignment.setStatus(TaskStatus.IN_PROGRESS);
        assignmentRepository.saveAndFlush(assignment);

        var mine = assignmentRepository.findEmployeeTasks(employee.getId(), TaskStatus.IN_PROGRESS,
                TaskPriority.URGENT, "safety", PageRequest.of(0, 10));
        var managerView = taskRepository.searchManagerTasks(employee.getId(), TaskStatus.IN_PROGRESS,
                TaskPriority.URGENT, "safety", PageRequest.of(0, 10));
        assertEquals(1, mine.getTotalElements());
        assertEquals(task.getId(), mine.getContent().getFirst().getTask().getId());
        assertEquals(1, managerView.getTotalElements());
    }

    private User user(String email, UserRole role) {
        User user = new User();
        user.setFullName("Task Test User");
        user.setEmail(email);
        user.setPasswordHash("test-hash");
        user.setRole(role);
        user.setAccountStatus(AccountStatus.APPROVED);
        return user;
    }
}
