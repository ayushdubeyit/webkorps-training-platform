package com.webkorps.platform.training.module.repository;

import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import com.webkorps.platform.identity.repository.UserRepository;
import com.webkorps.platform.training.domain.entity.TrainingDomain;
import com.webkorps.platform.training.domain.repository.TrainingDomainRepository;
import com.webkorps.platform.training.module.entity.TrainingModule;
import com.webkorps.platform.training.module.entity.TrainingModuleFile;
import com.webkorps.platform.training.module.entity.TrainingModuleStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@ActiveProfiles("training-domain-test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TrainingModuleRepositoryIntegrationTest {

    @Autowired
    private TrainingModuleRepository moduleRepository;

    @Autowired
    private TrainingModuleFileRepository fileRepository;

    @Autowired
    private TrainingDomainRepository domainRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void flywaySchemaMapsModulesAndEnforcesUniquePdfContentPerModule() {
        String suffix = UUID.randomUUID().toString();
        User manager = userRepository.saveAndFlush(user("module-manager-" + suffix + "@example.com"));
        TrainingDomain domain = domainRepository.saveAndFlush(domain("Module Test " + suffix));

        TrainingModule module = new TrainingModule();
        module.setDomain(domain);
        module.setCreatedBy(manager);
        module.setTitle("Java Fundamentals");
        module.setStatus(TrainingModuleStatus.DRAFT);
        module = moduleRepository.saveAndFlush(module);

        assertEquals(TrainingModuleStatus.DRAFT, moduleRepository.findById(module.getId()).orElseThrow().getStatus());

        TrainingModuleFile first = file(module, manager, "a".repeat(64));
        fileRepository.saveAndFlush(first);
        TrainingModuleFile duplicate = file(module, manager, "a".repeat(64));
        assertThrows(DataIntegrityViolationException.class, () -> fileRepository.saveAndFlush(duplicate));
    }

    private User user(String email) {
        User user = new User();
        user.setFullName("Training Module Test Manager");
        user.setEmail(email);
        user.setPasswordHash("test-only-hash");
        user.setRole(UserRole.MANAGER);
        user.setAccountStatus(AccountStatus.APPROVED);
        return user;
    }

    private TrainingDomain domain(String name) {
        TrainingDomain domain = new TrainingDomain();
        domain.setName(name);
        domain.setActive(true);
        return domain;
    }

    private TrainingModuleFile file(TrainingModule module, User manager, String checksum) {
        TrainingModuleFile file = new TrainingModuleFile();
        file.setModule(module);
        file.setUploadedBy(manager);
        file.setOriginalFilename("guide.pdf");
        file.setStorageKey(UUID.randomUUID() + ".pdf");
        file.setMimeType("application/pdf");
        file.setSizeBytes(10);
        file.setSha256(checksum);
        return file;
    }
}
