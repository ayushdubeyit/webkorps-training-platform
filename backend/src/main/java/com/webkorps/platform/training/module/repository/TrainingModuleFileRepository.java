package com.webkorps.platform.training.module.repository;

import com.webkorps.platform.training.module.entity.TrainingModuleFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainingModuleFileRepository extends JpaRepository<TrainingModuleFile, Long> {

    boolean existsByModuleIdAndSha256(Long moduleId, String sha256);

    Optional<TrainingModuleFile> findFirstByModuleIdOrderByCreatedAtDescIdDesc(Long moduleId);
}
