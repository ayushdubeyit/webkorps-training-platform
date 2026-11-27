package com.webkorps.platform.training.module.service;

import com.webkorps.platform.common.exception.DuplicateTrainingModuleFileException;
import com.webkorps.platform.common.exception.InvalidTrainingModuleException;
import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.TrainingModuleCreateRequest;
import com.webkorps.platform.dto.TrainingModuleUpdateRequest;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.training.domain.entity.TrainingDomain;
import com.webkorps.platform.training.domain.repository.TrainingDomainRepository;
import com.webkorps.platform.training.module.entity.TrainingModule;
import com.webkorps.platform.training.module.entity.TrainingModuleFile;
import com.webkorps.platform.training.module.entity.TrainingModuleStatus;
import com.webkorps.platform.training.module.repository.TrainingModuleFileRepository;
import com.webkorps.platform.training.module.repository.TrainingModuleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrainingModuleServiceTest {

    @Mock
    private TrainingModuleRepository moduleRepository;

    @Mock
    private TrainingModuleFileRepository fileRepository;

    @Mock
    private TrainingDomainRepository domainRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TrainingFileStorageService fileStorageService;

    @InjectMocks
    private TrainingModuleService service;

    @Test
    void createsDraftUsingAuthenticatedManager() {
        TrainingDomain domain = domain(2L, true);
        User manager = user(3L, "manager@example.com", UserRole.MANAGER);
        when(domainRepository.findById(2L)).thenReturn(Optional.of(domain));
        when(userRepository.findByEmail(manager.getEmail())).thenReturn(Optional.of(manager));
        when(moduleRepository.save(any(TrainingModule.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.createModule(
                new TrainingModuleCreateRequest(2L, " Java Basics ", " Intro "), manager.getEmail());

        assertEquals(TrainingModuleStatus.DRAFT, response.status());
        assertEquals("Java Basics", response.title());
        assertEquals("Intro", response.description());
        assertEquals(3L, response.createdById());
    }

    @Test
    void rejectsMissingOrInactiveDomains() {
        when(domainRepository.findById(404L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class,
                () -> service.createModule(new TrainingModuleCreateRequest(404L, "Java", null), "manager"));

        when(domainRepository.findById(5L)).thenReturn(Optional.of(domain(5L, false)));
        assertThrows(InvalidTrainingModuleException.class,
                () -> service.createModule(new TrainingModuleCreateRequest(5L, "Java", null), "manager"));
    }

    @Test
    void updatesMetadataAndRejectsUnknownDomainId() {
        TrainingModule module = module(11L, TrainingModuleStatus.DRAFT);
        when(moduleRepository.findById(11L)).thenReturn(Optional.of(module));
        when(moduleRepository.save(any(TrainingModule.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.updateModule(11L, new TrainingModuleUpdateRequest(null, " New title ", null));
        assertEquals("New title", response.title());

        when(moduleRepository.findById(11L)).thenReturn(Optional.of(module(11L, TrainingModuleStatus.DRAFT)));
        when(domainRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class,
                () -> service.updateModule(11L, new TrainingModuleUpdateRequest(999L, null, null)));
    }

    @Test
    void publishesAndArchivesModulesIdempotently() {
        TrainingModule module = module(11L, TrainingModuleStatus.DRAFT);
        when(moduleRepository.findById(11L)).thenReturn(Optional.of(module));
        when(moduleRepository.save(any(TrainingModule.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var published = service.publishModule(11L);
        assertEquals(TrainingModuleStatus.PUBLISHED, published.status());
        assertNotNull(published.publishedAt());

        var archived = service.archiveModule(11L);
        assertEquals(TrainingModuleStatus.ARCHIVED, archived.status());
        assertEquals(published.publishedAt(), archived.publishedAt());
    }

    @Test
    void returnsOnlyPublishedModulesAndAppliesPaginationFilters() {
        TrainingModule module = module(11L, TrainingModuleStatus.PUBLISHED);
        when(moduleRepository.findModules(eq(TrainingModuleStatus.PUBLISHED), eq(2L), eq("Java"),
                any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(module), PageRequest.of(0, 10), 1));

        var page = service.getPublishedModules(0, 10, 2L, " Java ");

        assertEquals(1, page.getTotalElements());
        assertEquals(TrainingModuleStatus.PUBLISHED, page.getContent().getFirst().status());
    }

    @Test
    void rejectsInvalidDomainFilterAndMissingModuleIds() {
        when(domainRepository.existsById(404L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class,
                () -> service.getPublishedModules(0, 10, 404L, null));

        when(moduleRepository.findById(404L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getModule(404L, true));
    }

    @Test
    void hidesDraftsFromEmployeesButAllowsManagerAccess() {
        when(moduleRepository.findById(11L)).thenReturn(Optional.of(module(11L, TrainingModuleStatus.DRAFT)));

        assertThrows(ResourceNotFoundException.class, () -> service.getModule(11L, false));
        assertEquals(TrainingModuleStatus.DRAFT, service.getModule(11L, true).status());
    }

    @Test
    void uploadsNewPdfVersionAndRejectsDuplicateContent() {
        TrainingModule module = module(11L, TrainingModuleStatus.PUBLISHED);
        User manager = user(3L, "manager@example.com", UserRole.MANAGER);
        MockMultipartFile file = new MockMultipartFile("file", "guide.pdf", "application/pdf",
                "%PDF-1.7 test".getBytes());
        when(moduleRepository.findById(11L)).thenReturn(Optional.of(module));
        when(userRepository.findByEmail(manager.getEmail())).thenReturn(Optional.of(manager));
        when(fileStorageService.store(file)).thenReturn(
                new StoredTrainingFile("17ac1682-851d-43e8-a624-a5c9ec33dc74.pdf", "guide.pdf", 14, "abc"));
        when(fileRepository.existsByModuleIdAndSha256(11L, "abc")).thenReturn(false);
        when(fileRepository.saveAndFlush(any(TrainingModuleFile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.uploadPdf(11L, file, "v1", manager.getEmail());

        assertEquals("guide.pdf", response.originalFilename());
        assertEquals("v1", response.versionNote());

        when(fileRepository.existsByModuleIdAndSha256(11L, "abc")).thenReturn(true);
        assertThrows(DuplicateTrainingModuleFileException.class,
                () -> service.uploadPdf(11L, file, "same file", manager.getEmail()));
        verify(fileStorageService).deleteQuietly("17ac1682-851d-43e8-a624-a5c9ec33dc74.pdf");
        verify(fileRepository, times(1)).saveAndFlush(any(TrainingModuleFile.class));
    }

    private TrainingDomain domain(Long id, boolean active) {
        TrainingDomain domain = new TrainingDomain();
        domain.setId(id);
        domain.setName("Java");
        domain.setActive(active);
        return domain;
    }

    private User user(Long id, String email, UserRole role) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setFullName("Test User");
        user.setRole(role);
        user.setAccountStatus(AccountStatus.APPROVED);
        return user;
    }

    private TrainingModule module(Long id, TrainingModuleStatus status) {
        TrainingModule module = new TrainingModule();
        module.setId(id);
        module.setDomain(domain(2L, true));
        module.setCreatedBy(user(3L, "manager@example.com", UserRole.MANAGER));
        module.setTitle("Java Basics");
        module.setDescription("Intro");
        module.setStatus(status);
        return module;
    }
}
