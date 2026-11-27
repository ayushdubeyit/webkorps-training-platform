package com.webkorps.platform.training.domain.service;

import com.webkorps.platform.common.exception.DomainNameAlreadyExistsException;
import com.webkorps.platform.common.exception.InvalidTrainingDomainException;
import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.TrainingDomainCreateRequest;
import com.webkorps.platform.dto.TrainingDomainUpdateRequest;
import com.webkorps.platform.training.domain.entity.TrainingDomain;
import com.webkorps.platform.training.domain.repository.TrainingDomainRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.sql.SQLException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrainingDomainServiceTest {

    @Mock
    private TrainingDomainRepository repository;

    @InjectMocks
    private TrainingDomainService service;

    @Test
    void createsTrimmedActiveDomain() {
        when(repository.existsByNameIgnoreCase("Java")).thenReturn(false);
        when(repository.saveAndFlush(any(TrainingDomain.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.createDomain(new TrainingDomainCreateRequest(" Java ", " Basics "));

        assertEquals("Java", response.name());
        assertEquals("Basics", response.description());
        assertTrue(response.active());
    }

    @Test
    void rejectsBlankName() {
        assertThrows(InvalidTrainingDomainException.class,
                () -> service.createDomain(new TrainingDomainCreateRequest("  ", null)));
        verify(repository, never()).saveAndFlush(any());
    }

    @Test
    void rejectsDuplicateNameCaseInsensitively() {
        when(repository.existsByNameIgnoreCase("java")).thenReturn(true);

        assertThrows(DomainNameAlreadyExistsException.class,
                () -> service.createDomain(new TrainingDomainCreateRequest("java", null)));
    }

    @Test
    void mapsConcurrentDomainNameUniqueViolationToConflictException() {
        when(repository.existsByNameIgnoreCase("Java")).thenReturn(false);
        when(repository.saveAndFlush(any(TrainingDomain.class))).thenThrow(
                new DataIntegrityViolationException("duplicate name",
                        new SQLException("Duplicate entry for key 'training_domains.uk_training_domains_name'",
                                "23000", 1062)));

        assertThrows(DomainNameAlreadyExistsException.class,
                () -> service.createDomain(new TrainingDomainCreateRequest("Java", null)));
    }

    @Test
    void doesNotReportOtherIntegrityViolationsAsDuplicateNames() {
        when(repository.existsByNameIgnoreCase("Java")).thenReturn(false);
        DataIntegrityViolationException failure = new DataIntegrityViolationException(
                "foreign key violation", new SQLException("Foreign key violation", "23000", 1452));
        when(repository.saveAndFlush(any(TrainingDomain.class))).thenThrow(failure);

        assertThrows(DataIntegrityViolationException.class,
                () -> service.createDomain(new TrainingDomainCreateRequest("Java", null)));
    }

    @Test
    void updatesProvidedFieldsAndKeepsOmittedFields() {
        TrainingDomain existing = domain(3L, "Java", "Original");
        when(repository.findById(3L)).thenReturn(Optional.of(existing));
        when(repository.existsByNameIgnoreCaseAndIdNot("Java 21", 3L)).thenReturn(false);
        when(repository.saveAndFlush(any(TrainingDomain.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.updateDomain(3L, new TrainingDomainUpdateRequest(" Java 21 ", null));

        assertEquals("Java 21", response.name());
        assertEquals("Original", response.description());
    }

    @Test
    void rejectsDuplicateNameDuringUpdate() {
        when(repository.findById(3L)).thenReturn(Optional.of(domain(3L, "Java", null)));
        when(repository.existsByNameIgnoreCaseAndIdNot("Python", 3L)).thenReturn(true);

        assertThrows(DomainNameAlreadyExistsException.class,
                () -> service.updateDomain(3L, new TrainingDomainUpdateRequest("Python", null)));
    }

    @Test
    void returnsNotFoundForUnknownId() {
        when(repository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.updateDomain(404L, new TrainingDomainUpdateRequest("Python", null)));
    }

    @Test
    void deactivatesAndRepeatedDeactivationIsIdempotent() {
        TrainingDomain existing = domain(3L, "Java", null);
        when(repository.findById(3L)).thenReturn(Optional.of(existing));

        var first = service.deactivateDomain(3L);
        var second = service.deactivateDomain(3L);

        assertFalse(first.active());
        assertFalse(second.active());
        verify(repository).save(existing);
        verify(repository).findById(3L);
    }

    @Test
    void rejectsEmptyPatch() {
        when(repository.findById(3L)).thenReturn(Optional.of(domain(3L, "Java", null)));

        assertThrows(InvalidTrainingDomainException.class,
                () -> service.updateDomain(3L, new TrainingDomainUpdateRequest(null, null)));
    }

    private TrainingDomain domain(Long id, String name, String description) {
        TrainingDomain domain = new TrainingDomain();
        domain.setId(id);
        domain.setName(name);
        domain.setDescription(description);
        return domain;
    }
}
