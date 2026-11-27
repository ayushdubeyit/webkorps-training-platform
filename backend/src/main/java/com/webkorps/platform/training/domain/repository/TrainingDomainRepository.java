package com.webkorps.platform.training.domain.repository;

import com.webkorps.platform.training.domain.entity.TrainingDomain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingDomainRepository extends JpaRepository<TrainingDomain, Long> {

    List<TrainingDomain> findAllByActiveTrueOrderByNameAsc();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
