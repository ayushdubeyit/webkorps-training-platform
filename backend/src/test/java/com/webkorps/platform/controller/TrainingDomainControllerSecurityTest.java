package com.webkorps.platform.controller;

import com.webkorps.platform.dto.TrainingDomainResponse;
import com.webkorps.platform.identity.config.SecurityConfig;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.identity.service.CustomUserDetailsService;
import com.webkorps.platform.identity.service.JwtService;
import com.webkorps.platform.training.domain.service.TrainingDomainService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TrainingDomainController.class)
@Import(SecurityConfig.class)
class TrainingDomainControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TrainingDomainService domainService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void managerCanCreateDomain() throws Exception {
        String token = "approved-manager-token";
        authenticate(token, "manager@example.com", UserRole.MANAGER, AccountStatus.APPROVED);
        when(domainService.createDomain(any())).thenReturn(domain(1L, "Java", true));

        mockMvc.perform(post("/api/v1/manager/domains")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Java\",\"description\":\"Core Java\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Java"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    void domainValidationUsesApiErrorResponse() throws Exception {
        String token = "approved-manager-token";
        authenticate(token, "manager@example.com", UserRole.MANAGER, AccountStatus.APPROVED);

        mockMvc.perform(post("/api/v1/manager/domains")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"  \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    void managerCanUpdateDomain() throws Exception {
        String token = "approved-manager-token";
        authenticate(token, "manager@example.com", UserRole.MANAGER, AccountStatus.APPROVED);
        when(domainService.updateDomain(eq(1L), any())).thenReturn(domain(1L, "Java Advanced", true));

        mockMvc.perform(patch("/api/v1/manager/domains/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Java Advanced\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Java Advanced"));
    }

    @Test
    void managerCanDeactivateDomain() throws Exception {
        String token = "approved-manager-token";
        authenticate(token, "manager@example.com", UserRole.MANAGER, AccountStatus.APPROVED);
        when(domainService.deactivateDomain(1L)).thenReturn(domain(1L, "Java", false));

        mockMvc.perform(patch("/api/v1/manager/domains/1/deactivate")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    @Test
    void employeeCanListActiveDomains() throws Exception {
        String token = "approved-employee-token";
        authenticate(token, "employee@example.com", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        when(domainService.getActiveDomains()).thenReturn(List.of(domain(1L, "Java", true)));

        mockMvc.perform(get("/api/v1/domains")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Java"));
    }

    @Test
    void employeeCannotCreateDomain() throws Exception {
        String token = "approved-employee-token";
        authenticate(token, "employee@example.com", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        mockMvc.perform(post("/api/v1/manager/domains")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Java\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void employeeCannotUpdateDomain() throws Exception {
        String token = "approved-employee-token";
        authenticate(token, "employee@example.com", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        mockMvc.perform(patch("/api/v1/manager/domains/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Java Advanced\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void employeeCannotDeactivateDomain() throws Exception {
        String token = "approved-employee-token";
        authenticate(token, "employee@example.com", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        mockMvc.perform(patch("/api/v1/manager/domains/1/deactivate")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void nonApprovedAccountCannotListDomains() throws Exception {
        String token = "pending-employee-token";
        authenticate(token, "pending@example.com", UserRole.EMPLOYEE, AccountStatus.PENDING);

        mockMvc.perform(get("/api/v1/domains")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
        verify(jwtService, never()).isTokenValid(eq(token), any(User.class));
    }

    @Test
    void unauthenticatedUserCannotListDomains() throws Exception {
        mockMvc.perform(get("/api/v1/domains"))
                .andExpect(status().isUnauthorized());
    }

    private void authenticate(String token, String email, UserRole role, AccountStatus status) {
        User user = new User();
        user.setEmail(email);
        user.setRole(role);
        user.setAccountStatus(status);

        when(jwtService.extractEmail(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid(token, user)).thenReturn(true);
    }

    private TrainingDomainResponse domain(Long id, String name, boolean active) {
        LocalDateTime now = LocalDateTime.of(2026, 11, 27, 10, 30);
        return new TrainingDomainResponse(id, name, "Core Java", active, now, now);
    }
}
