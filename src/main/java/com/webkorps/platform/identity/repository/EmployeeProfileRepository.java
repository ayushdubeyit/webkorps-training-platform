package com.webkorps.platform.identity.repository;

import com.webkorps.platform.identity.entity.EmployeeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile , Long> {


    Optional<EmployeeProfile> findByUserId(Long userId);

    boolean existsByEmployeeCode(String employeeCode);


}
