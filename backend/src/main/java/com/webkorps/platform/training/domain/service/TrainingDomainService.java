package com.webkorps.platform.training.domain.service;

import com.webkorps.platform.common.exception.DomainNameAlreadyExistsException;
import com.webkorps.platform.common.exception.InvalidTrainingDomainException;
import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.TrainingDomainCreateRequest;
import com.webkorps.platform.dto.TrainingDomainResponse;
import com.webkorps.platform.dto.TrainingDomainUpdateRequest;
import com.webkorps.platform.training.domain.entity.TrainingDomain;
import com.webkorps.platform.training.domain.repository.TrainingDomainRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Locale;

@Service
public class TrainingDomainService {

    private final TrainingDomainRepository domainRepository;

    public TrainingDomainService(TrainingDomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    @Transactional(readOnly = true)
    public List<TrainingDomainResponse> getActiveDomains() {
        return domainRepository.findAllByActiveTrueOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TrainingDomainResponse createDomain(TrainingDomainCreateRequest request) {
        String name = requireName(request.name());
        ensureNameAvailable(name, null);

        TrainingDomain domain = new TrainingDomain();
        domain.setName(name);
        domain.setDescription(trimToNull(request.description()));
        domain.setActive(true);
        return save(domain, name);
    }

    @Transactional
    public TrainingDomainResponse updateDomain(Long id, TrainingDomainUpdateRequest request) {
        TrainingDomain domain = findDomain(id);

        if (request.name() == null && request.description() == null) {
            throw new InvalidTrainingDomainException("At least one of name or description must be supplied");
        }

        if (request.name() != null) {
            String name = requireName(request.name());
            ensureNameAvailable(name, id);
            domain.setName(name);
        }
        if (request.description() != null) {
            domain.setDescription(trimToNull(request.description()));
        }

        return save(domain, domain.getName());
    }

    @Transactional
    public TrainingDomainResponse deactivateDomain(Long id) {
        TrainingDomain domain = findDomain(id);
        if (domain.isActive()) {
            domain.setActive(false);
            domain = domainRepository.save(domain);
        }
        return toResponse(domain);
    }

    private TrainingDomain findDomain(Long id) {
        return domainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training domain not found with ID: " + id));
    }

    private void ensureNameAvailable(String name, Long id) {
        boolean exists = id == null
                ? domainRepository.existsByNameIgnoreCase(name)
                : domainRepository.existsByNameIgnoreCaseAndIdNot(name, id);
        if (exists) {
            throw new DomainNameAlreadyExistsException(name);
        }
    }

    private String requireName(String name) {
        String trimmed = name == null ? "" : name.trim();
        if (trimmed.isEmpty()) {
            throw new InvalidTrainingDomainException("Name must not be blank");
        }
        if (trimmed.length() > 100) {
            throw new InvalidTrainingDomainException("Name must be at most 100 characters");
        }
        return trimmed;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private TrainingDomainResponse save(TrainingDomain domain, String checkedName) {
        try {
            return toResponse(domainRepository.saveAndFlush(domain));
        } catch (DataIntegrityViolationException exception) {
            if (isDomainNameUniqueViolation(exception)) {
                throw new DomainNameAlreadyExistsException(checkedName);
            }
            throw exception;
        }
    }

    private boolean isDomainNameUniqueViolation(DataIntegrityViolationException exception) {
        for (Throwable cause = exception; cause != null; cause = cause.getCause()) {
            if (cause instanceof org.hibernate.exception.ConstraintViolationException violation
                    && "uk_training_domains_name".equalsIgnoreCase(violation.getConstraintName())) {
                return true;
            }
            if (cause instanceof SQLException sqlException
                    && sqlException.getErrorCode() == 1062
                    && sqlException.getMessage() != null
                    && sqlException.getMessage().toLowerCase(Locale.ROOT)
                    .contains("uk_training_domains_name")) {
                return true;
            }
        }
        return false;
    }

    private TrainingDomainResponse toResponse(TrainingDomain domain) {
        return new TrainingDomainResponse(
                domain.getId(), domain.getName(), domain.getDescription(), domain.isActive(),
                domain.getCreatedAt(), domain.getUpdatedAt()
        );
    }
}
