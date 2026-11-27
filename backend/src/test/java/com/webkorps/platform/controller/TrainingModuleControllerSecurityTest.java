package com.webkorps.platform.controller;

import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.TrainingModuleFileResponse;
import com.webkorps.platform.dto.TrainingModuleResponse;
import com.webkorps.platform.identity.config.SecurityConfig;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.identity.service.CustomUserDetailsService;
import com.webkorps.platform.identity.service.JwtService;
import com.webkorps.platform.training.module.entity.TrainingModuleStatus;
import com.webkorps.platform.training.module.service.DownloadedTrainingFile;
import com.webkorps.platform.training.module.service.TrainingModuleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TrainingModuleController.class)
@Import(SecurityConfig.class)
class TrainingModuleControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TrainingModuleService moduleService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void approvedManagerCanCreateUpdatePublishArchiveAndUpload() throws Exception {
        String token = "approved-manager-token";
        authenticate(token, "manager@example.com", UserRole.MANAGER, AccountStatus.APPROVED);
        when(moduleService.createModule(any(), eq("manager@example.com")))
                .thenReturn(module(7L, TrainingModuleStatus.DRAFT));
        when(moduleService.updateModule(eq(7L), any()))
                .thenReturn(module(7L, TrainingModuleStatus.DRAFT));
        when(moduleService.publishModule(7L)).thenReturn(module(7L, TrainingModuleStatus.PUBLISHED));
        when(moduleService.archiveModule(7L)).thenReturn(module(7L, TrainingModuleStatus.ARCHIVED));
        when(moduleService.uploadPdf(eq(7L), any(), eq("version one"), eq("manager@example.com")))
                .thenReturn(fileResponse());

        mockMvc.perform(post("/api/v1/manager/modules")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"domainId\":2,\"title\":\"Java Basics\",\"description\":\"Intro\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("DRAFT"));

        mockMvc.perform(patch("/api/v1/manager/modules/7")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Java Basics Updated\"}"))
                .andExpect(status().isOk());
        mockMvc.perform(patch("/api/v1/manager/modules/7/publish")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PUBLISHED"));
        mockMvc.perform(patch("/api/v1/manager/modules/7/archive")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ARCHIVED"));

        MockMultipartFile pdf = new MockMultipartFile("file", "guide.pdf", "application/pdf",
                "%PDF-1.7 test".getBytes());
        mockMvc.perform(multipart("/api/v1/manager/modules/7/files")
                        .file(pdf)
                        .param("versionNote", "version one")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.originalFilename").value("guide.pdf"));
    }

    @Test
    void approvedEmployeeCanBrowsePublishedModules() throws Exception {
        String token = "approved-employee-token";
        authenticate(token, "employee@example.com", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        when(moduleService.getPublishedModules(0, 20, 2L, "java"))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(
                        java.util.List.of(module(7L, TrainingModuleStatus.PUBLISHED))));

        mockMvc.perform(get("/api/v1/modules")
                        .header("Authorization", "Bearer " + token)
                        .param("domainId", "2")
                        .param("search", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].status").value("PUBLISHED"));
    }

    @Test
    void employeeCannotAccessManagerModuleOperations() throws Exception {
        String token = "approved-employee-token";
        authenticate(token, "employee@example.com", UserRole.EMPLOYEE, AccountStatus.APPROVED);

        mockMvc.perform(post("/api/v1/manager/modules")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"domainId\":2,\"title\":\"Java\"}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(patch("/api/v1/manager/modules/7")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Updated\"}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(patch("/api/v1/manager/modules/7/publish")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        mockMvc.perform(patch("/api/v1/manager/modules/7/archive")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        mockMvc.perform(multipart("/api/v1/manager/modules/7/files")
                        .file(new MockMultipartFile("file", "guide.pdf", "application/pdf", "%PDF-1.7".getBytes()))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void employeeCannotViewOrDownloadDraftModules() throws Exception {
        String token = "approved-employee-token";
        authenticate(token, "employee@example.com", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        when(moduleService.getModule(7L, false))
                .thenThrow(new ResourceNotFoundException("Training module not found with ID: 7"));
        when(moduleService.getLatestPdf(7L, false))
                .thenThrow(new ResourceNotFoundException("Training module not found with ID: 7"));

        mockMvc.perform(get("/api/v1/modules/7")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/api/v1/modules/7/download")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void approvedEmployeeCanDownloadPublishedPdf() throws Exception {
        String token = "approved-employee-token";
        authenticate(token, "employee@example.com", UserRole.EMPLOYEE, AccountStatus.APPROVED);
        when(moduleService.getLatestPdf(7L, false)).thenReturn(new DownloadedTrainingFile(
                new ByteArrayResource("%PDF-1.7".getBytes()), "guide.pdf", 8));

        mockMvc.perform(get("/api/v1/modules/7/download")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"));
    }

    @Test
    void approvedManagerCanDownloadDraftPdfWithAttachmentHeaders() throws Exception {
        String token = "approved-manager-token";
        authenticate(token, "manager@example.com", UserRole.MANAGER, AccountStatus.APPROVED);
        when(moduleService.getLatestPdf(7L, true)).thenReturn(new DownloadedTrainingFile(
                new ByteArrayResource("%PDF-1.7".getBytes()), "guide.pdf", 8));

        mockMvc.perform(get("/api/v1/modules/7/download")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("guide.pdf")));
    }

    @Test
    void pendingEmployeeAndUnauthenticatedUserReceiveUnauthorized() throws Exception {
        String token = "pending-employee-token";
        authenticate(token, "pending@example.com", UserRole.EMPLOYEE, AccountStatus.PENDING);

        mockMvc.perform(get("/api/v1/modules")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/v1/modules"))
                .andExpect(status().isUnauthorized());
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

    private TrainingModuleResponse module(Long id, TrainingModuleStatus status) {
        LocalDateTime now = LocalDateTime.of(2026, 11, 27, 10, 30);
        return new TrainingModuleResponse(id, 2L, "Java", "Java Basics", "Intro", status,
                3L, "Manager", now, now, status == TrainingModuleStatus.PUBLISHED ? now : null);
    }

    private TrainingModuleFileResponse fileResponse() {
        return new TrainingModuleFileResponse(9L, "guide.pdf", "application/pdf", 20,
                "version one", 3L, "Manager", LocalDateTime.of(2026, 11, 27, 10, 30));
    }
}
