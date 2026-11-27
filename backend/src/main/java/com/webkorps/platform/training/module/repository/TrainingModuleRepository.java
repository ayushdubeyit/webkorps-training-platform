package com.webkorps.platform.training.module.repository;

import com.webkorps.platform.training.module.entity.TrainingModule;
import com.webkorps.platform.training.module.entity.TrainingModuleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TrainingModuleRepository extends JpaRepository<TrainingModule, Long> {

    @Query(value = """
            SELECT m FROM TrainingModule m
            WHERE m.status = :status
              AND (:domainId IS NULL OR m.domain.id = :domainId)
              AND (:search IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')))
            """,
            countQuery = """
            SELECT COUNT(m) FROM TrainingModule m
            WHERE m.status = :status
              AND (:domainId IS NULL OR m.domain.id = :domainId)
              AND (:search IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<TrainingModule> findModules(
            @Param("status") TrainingModuleStatus status,
            @Param("domainId") Long domainId,
            @Param("search") String search,
            Pageable pageable);
}
