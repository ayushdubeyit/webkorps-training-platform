package com.webkorps.platform.training.module.service;

import com.webkorps.platform.common.exception.DuplicateTrainingModuleFileException;
import com.webkorps.platform.common.exception.InvalidTrainingModuleException;
import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.TrainingModuleCreateRequest;
import com.webkorps.platform.dto.TrainingModuleFileResponse;
import com.webkorps.platform.dto.TrainingModuleResponse;
import com.webkorps.platform.dto.TrainingModuleUpdateRequest;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.training.domain.entity.TrainingDomain;
import com.webkorps.platform.training.domain.repository.TrainingDomainRepository;
import com.webkorps.platform.training.module.entity.TrainingModule;
import com.webkorps.platform.training.module.entity.TrainingModuleFile;
import com.webkorps.platform.training.module.entity.TrainingModuleStatus;
import com.webkorps.platform.training.module.repository.TrainingModuleFileRepository;
import com.webkorps.platform.training.module.repository.TrainingModuleRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class TrainingModuleService {

    private static final String FILE_CHECKSUM_CONSTRAINT = "uk_training_module_files_module_sha256";

    private final TrainingModuleRepository moduleRepository;
    private final TrainingModuleFileRepository fileRepository;
    private final TrainingDomainRepository domainRepository;
    private final UserRepository userRepository;
    private final TrainingFileStorageService fileStorageService;

    public TrainingModuleService(
            TrainingModuleRepository moduleRepository,
            TrainingModuleFileRepository fileRepository,
            TrainingDomainRepository domainRepository,
            UserRepository userRepository,
            TrainingFileStorageService fileStorageService) {
        this.moduleRepository = moduleRepository;
        this.fileRepository = fileRepository;
        this.domainRepository = domainRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public Page<TrainingModuleResponse> getPublishedModules(
            int page, int size, Long domainId, String search) {
        Pageable pageable = pageRequest(page, size);
        if (domainId != null && !domainRepository.existsById(domainId)) {
            throw new ResourceNotFoundException("Training domain not found with ID: " + domainId);
        }
        String normalizedSearch = normalizeSearch(search);
        return moduleRepository.findModules(TrainingModuleStatus.PUBLISHED, domainId,
                        normalizedSearch, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public TrainingModuleResponse getModule(Long id, boolean manager) {
        TrainingModule module = findModule(id);
        if (!manager && module.getStatus() != TrainingModuleStatus.PUBLISHED) {
            throw new ResourceNotFoundException("Training module not found with ID: " + id);
        }
        return toResponse(module);
    }

    @Transactional
    public TrainingModuleResponse createModule(TrainingModuleCreateRequest request, String managerEmail) {
        TrainingDomain domain = findActiveDomain(request.domainId());
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Manager account was not found"));

        TrainingModule module = new TrainingModule();
        module.setDomain(domain);
        module.setTitle(requireTitle(request.title()));
        module.setDescription(trimToNull(request.description()));
        module.setStatus(TrainingModuleStatus.DRAFT);
        module.setCreatedBy(manager);
        return toResponse(moduleRepository.save(module));
    }

    @Transactional
    public TrainingModuleResponse updateModule(Long id, TrainingModuleUpdateRequest request) {
        TrainingModule module = findModule(id);
        if (module.getStatus() == TrainingModuleStatus.ARCHIVED) {
            throw new InvalidTrainingModuleException("Archived training modules cannot be updated");
        }
        if (request.domainId() == null && request.title() == null && request.description() == null) {
            throw new InvalidTrainingModuleException("At least one module field must be supplied");
        }
        if (request.domainId() != null) {
            module.setDomain(findActiveDomain(request.domainId()));
        }
        if (request.title() != null) {
            module.setTitle(requireTitle(request.title()));
        }
        if (request.description() != null) {
            module.setDescription(trimToNull(request.description()));
        }
        return toResponse(moduleRepository.save(module));
    }

    @Transactional
    public TrainingModuleResponse publishModule(Long id) {
        TrainingModule module = findModule(id);
        if (module.getStatus() == TrainingModuleStatus.ARCHIVED) {
            throw new InvalidTrainingModuleException("Archived training modules cannot be published");
        }
        if (module.getStatus() == TrainingModuleStatus.DRAFT) {
            module.setStatus(TrainingModuleStatus.PUBLISHED);
            module.setPublishedAt(LocalDateTime.now());
            module = moduleRepository.save(module);
        }
        return toResponse(module);
    }

    @Transactional
    public TrainingModuleResponse archiveModule(Long id) {
        TrainingModule module = findModule(id);
        if (module.getStatus() != TrainingModuleStatus.ARCHIVED) {
            module.setStatus(TrainingModuleStatus.ARCHIVED);
            module = moduleRepository.save(module);
        }
        return toResponse(module);
    }

    @Transactional
    public TrainingModuleFileResponse uploadPdf(
            Long moduleId, MultipartFile file, String versionNote, String managerEmail) {
        TrainingModule module = findModule(moduleId);
        if (module.getStatus() == TrainingModuleStatus.ARCHIVED) {
            throw new InvalidTrainingModuleException("Files cannot be uploaded to archived modules");
        }
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Manager account was not found"));

        StoredTrainingFile storedFile = fileStorageService.store(file);
        boolean transactionSynchronizationRegistered = registerRollbackCleanup(storedFile.storageKey());
        try {
            if (fileRepository.existsByModuleIdAndSha256(moduleId, storedFile.sha256())) {
                throw new DuplicateTrainingModuleFileException();
            }

            TrainingModuleFile moduleFile = new TrainingModuleFile();
            moduleFile.setModule(module);
            moduleFile.setUploadedBy(manager);
            moduleFile.setOriginalFilename(storedFile.originalFilename());
            moduleFile.setStorageKey(storedFile.storageKey());
            moduleFile.setMimeType("application/pdf");
            moduleFile.setSizeBytes(storedFile.sizeBytes());
            moduleFile.setSha256(storedFile.sha256());
            moduleFile.setVersionNote(trimVersionNote(versionNote));
            return toFileResponse(fileRepository.saveAndFlush(moduleFile));
        } catch (DataIntegrityViolationException exception) {
            if (!transactionSynchronizationRegistered) {
                fileStorageService.deleteQuietly(storedFile.storageKey());
            }
            if (isDuplicateFileViolation(exception)) {
                throw new DuplicateTrainingModuleFileException();
            }
            throw exception;
        } catch (RuntimeException exception) {
            if (!transactionSynchronizationRegistered) {
                fileStorageService.deleteQuietly(storedFile.storageKey());
            }
            throw exception;
        }
    }

    @Transactional(readOnly = true)
    public DownloadedTrainingFile getLatestPdf(Long moduleId, boolean manager) {
        TrainingModule module = findModule(moduleId);
        if (!manager && module.getStatus() != TrainingModuleStatus.PUBLISHED) {
            throw new ResourceNotFoundException("Training module not found with ID: " + moduleId);
        }
        TrainingModuleFile file = fileRepository.findFirstByModuleIdOrderByCreatedAtDescIdDesc(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("No PDF is available for this training module"));
        return new DownloadedTrainingFile(fileStorageService.loadAsResource(file.getStorageKey()),
                file.getOriginalFilename(), file.getSizeBytes());
    }

    private TrainingModule findModule(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training module not found with ID: " + id));
    }

    private TrainingDomain findActiveDomain(Long domainId) {
        TrainingDomain domain = domainRepository.findById(domainId)
                .orElseThrow(() -> new ResourceNotFoundException("Training domain not found with ID: " + domainId));
        if (!domain.isActive()) {
            throw new InvalidTrainingModuleException("Training domain is inactive");
        }
        return domain;
    }

    private Pageable pageRequest(int page, int size) {
        if (page < 0) {
            throw new InvalidTrainingModuleException("Page number cannot be negative");
        }
        if (size < 1 || size > 100) {
            throw new InvalidTrainingModuleException("Page size must be between 1 and 100");
        }
        return PageRequest.of(page, size, Sort.by(
                Sort.Order.desc("publishedAt"), Sort.Order.desc("id")));
    }

    private String normalizeSearch(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }
        String normalized = search.trim();
        if (normalized.length() > 200) {
            throw new InvalidTrainingModuleException("Search text must be at most 200 characters");
        }
        return normalized;
    }

    private String requireTitle(String title) {
        String normalized = title == null ? "" : title.trim();
        if (normalized.isBlank()) {
            throw new InvalidTrainingModuleException("Title must not be blank");
        }
        if (normalized.length() > 200) {
            throw new InvalidTrainingModuleException("Title must be at most 200 characters");
        }
        return normalized;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String trimVersionNote(String versionNote) {
        if (versionNote == null) {
            return null;
        }
        String normalized = versionNote.trim();
        if (normalized.length() > 500) {
            throw new InvalidTrainingModuleException("Version note must be at most 500 characters");
        }
        return normalized.isEmpty() ? null : normalized;
    }

    private boolean registerRollbackCleanup(String storageKey) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            return false;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status != STATUS_COMMITTED) {
                    fileStorageService.deleteQuietly(storageKey);
                }
            }
        });
        return true;
    }

    private boolean isDuplicateFileViolation(DataIntegrityViolationException exception) {
        for (Throwable cause = exception; cause != null; cause = cause.getCause()) {
            if (cause instanceof ConstraintViolationException violation
                    && FILE_CHECKSUM_CONSTRAINT.equalsIgnoreCase(violation.getConstraintName())) {
                return true;
            }
            if (cause instanceof SQLException sqlException && sqlException.getErrorCode() == 1062
                    && sqlException.getMessage() != null
                    && sqlException.getMessage().toLowerCase(Locale.ROOT)
                    .contains(FILE_CHECKSUM_CONSTRAINT)) {
                return true;
            }
        }
        return false;
    }

    private TrainingModuleResponse toResponse(TrainingModule module) {
        return new TrainingModuleResponse(
                module.getId(), module.getDomain().getId(), module.getDomain().getName(),
                module.getTitle(), module.getDescription(), module.getStatus(),
                module.getCreatedBy().getId(), module.getCreatedBy().getFullName(),
                module.getCreatedAt(), module.getUpdatedAt(), module.getPublishedAt()
        );
    }

    private TrainingModuleFileResponse toFileResponse(TrainingModuleFile file) {
        return new TrainingModuleFileResponse(
                file.getId(), file.getOriginalFilename(), file.getMimeType(), file.getSizeBytes(),
                file.getVersionNote(), file.getUploadedBy().getId(), file.getUploadedBy().getFullName(),
                file.getCreatedAt()
        );
    }
}
