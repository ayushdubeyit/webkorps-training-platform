package com.webkorps.platform.controller;

import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.TaskResponse;
import com.webkorps.platform.dto.TaskRemarkResponse;
import com.webkorps.platform.identity.config.SecurityConfig;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.identity.service.CustomUserDetailsService;
import com.webkorps.platform.identity.service.JwtService;
import com.webkorps.platform.task.entity.TaskPriority;
import com.webkorps.platform.task.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({TaskController.class, ManagerTaskController.class})
@Import(SecurityConfig.class)
class TaskControllerSecurityTest {
    @Autowired MockMvc mockMvc;
    @MockitoBean TaskService taskService;
    @MockitoBean CustomUserDetailsService userDetailsService;
    @MockitoBean JwtService jwtService;
    @MockitoBean UserRepository userRepository;

    @Test
    void managerCanCreateAndListTasks() throws Exception {
        authenticate("manager-token", "manager@wtp.test", UserRole.MANAGER, AccountStatus.APPROVED);
        when(taskService.create(any(), eq("manager@wtp.test"))).thenReturn(taskResponse());
        when(taskService.managerTasks(0, 20, 3L, null, TaskPriority.HIGH, "safety"))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of(taskResponse())));
        when(taskService.assign(eq(8L), any())).thenReturn(taskResponse());

        mockMvc.perform(post("/api/v1/manager/tasks")
                        .header("Authorization", "Bearer manager-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Safety\",\"description\":\"Safety notes\",\"priority\":\"HIGH\",\"dueDate\":\"2027-01-20\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Safety"));

        mockMvc.perform(get("/api/v1/manager/tasks")
                        .header("Authorization", "Bearer manager-token")
                        .param("employeeId", "3").param("priority", "HIGH").param("search", "safety"))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/v1/manager/tasks/8/assign")
                        .header("Authorization", "Bearer manager-token")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"employeeIds\":[3,4]}"))
                .andExpect(status().isOk());
    }

    @Test
    void employeeCanListOwnTasksUpdateStatusAndAddRemark() throws Exception {
        authenticate("employee-token", "employee@wtp.test", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        when(taskService.employeeTasks("employee@wtp.test", 0, 20, null, null, null))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of(taskResponse())));
        when(taskService.updateStatus(eq(8L), any(), eq("employee@wtp.test"))).thenReturn(taskResponse());
        when(taskService.addRemark(eq(8L), any(), eq("employee@wtp.test")))
                .thenReturn(new TaskRemarkResponse(2L, 3L, "Employee", "Started", LocalDateTime.now()));

        mockMvc.perform(get("/api/v1/tasks").header("Authorization", "Bearer employee-token"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id").value(8));
        mockMvc.perform(patch("/api/v1/tasks/8/status")
                        .header("Authorization", "Bearer employee-token")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"IN_PROGRESS\"}"))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/v1/tasks/8/remarks")
                        .header("Authorization", "Bearer employee-token")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"remark\":\"Started\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void employeeCannotAccessManagerOperationsOrAnotherEmployeesTask() throws Exception {
        authenticate("employee-token", "employee@wtp.test", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        when(taskService.getTask(8L, "employee@wtp.test", false))
                .thenThrow(new ResourceNotFoundException("Task not found with ID: 8"));

        mockMvc.perform(post("/api/v1/manager/tasks")
                        .header("Authorization", "Bearer employee-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Safety\",\"priority\":\"HIGH\",\"dueDate\":\"2027-01-20\"}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/v1/manager/tasks").header("Authorization", "Bearer employee-token"))
                .andExpect(status().isForbidden());
        mockMvc.perform(patch("/api/v1/manager/tasks/8")
                        .header("Authorization", "Bearer employee-token")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"title\":\"Changed\"}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/v1/manager/tasks/8/assign")
                        .header("Authorization", "Bearer employee-token")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"employeeIds\":[3]}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/v1/tasks/8").header("Authorization", "Bearer employee-token"))
                .andExpect(status().isNotFound());
        verify(taskService, never()).getTask(8L, "employee@wtp.test", true);
    }

    @Test
    void pendingEmployeeAndAnonymousUserCannotViewTasks() throws Exception {
        authenticate("pending-token", "pending@wtp.test", UserRole.EMPLOYEE, AccountStatus.PENDING);
        mockMvc.perform(get("/api/v1/tasks").header("Authorization", "Bearer pending-token"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/v1/tasks")).andExpect(status().isUnauthorized());
        verify(taskService, never()).employeeTasks(any(), anyInt(), anyInt(), any(), any(), any());
    }

    private void authenticate(String token, String email, UserRole role, AccountStatus status) {
        User user = new User();
        user.setEmail(email);
        user.setFullName("Test User");
        user.setRole(role);
        user.setAccountStatus(status);
        when(jwtService.extractEmail(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid(token, user)).thenReturn(true);
    }

    private TaskResponse taskResponse() {
        return new TaskResponse(8L, "Safety", "Safety notes", TaskPriority.HIGH,
                LocalDate.of(2027, 1, 20), 1L, "Manager", LocalDateTime.now(), LocalDateTime.now(), List.of());
    }
}
