package com.webkorps.platform.training.domain.repository;

import com.webkorps.platform.training.domain.entity.TrainingDomain;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@ActiveProfiles("training-domain-test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TrainingDomainRepositoryIntegrationTest {

    @Autowired
    private TrainingDomainRepository repository;

    @Test
    void schemaIncludesTrainingDomainsAndEnforcesCaseInsensitiveUniqueNames() {
        repository.saveAndFlush(domain("Migration Check Domain"));

        assertThrows(DataIntegrityViolationException.class,
                () -> repository.saveAndFlush(domain("migration check domain")));
    }

    private TrainingDomain domain(String name) {
        TrainingDomain domain = new TrainingDomain();
        domain.setName(name);
        domain.setActive(true);
        return domain;
    }
}
