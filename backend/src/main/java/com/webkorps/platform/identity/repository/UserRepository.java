
package com.webkorps.platform.identity.repository;

import com.webkorps.platform.dto.EmployeeDirectoryResponse;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.entity.enums.AccountStatus;
import com.webkorps.platform.identity.entity.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query(
            value = """
            SELECT new com.webkorps.platform.dto.EmployeeDirectoryResponse(
                u.id,
                u.fullName,
                u.email,
                u.role,
                u.accountStatus,
                p.employeeCode,
                p.department,
                p.jobTitle,
                u.createdAt
            )
            FROM User u
            LEFT JOIN EmployeeProfile p ON p.user.id = u.id
            WHERE u.role = :role
            AND (
                :search IS NULL
                OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.department) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            AND (:status IS NULL OR u.accountStatus = :status)
            """,
            countQuery = """
            SELECT COUNT(u)
            FROM User u
            LEFT JOIN EmployeeProfile p ON p.user.id = u.id
            WHERE u.role = :role
            AND (
                :search IS NULL
                OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.department) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            AND (:status IS NULL OR u.accountStatus = :status)
            """
    )
    Page<EmployeeDirectoryResponse> findEmployeeDirectory(
            @Param("role") UserRole role,
            @Param("search") String search,
            @Param("status") AccountStatus status,
            Pageable pageable
    );
    long countByRole(com.webkorps.platform.identity.entity.enums.UserRole role);

    long countByRoleAndAccountStatus(
            com.webkorps.platform.identity.entity.enums.UserRole role,
            com.webkorps.platform.identity.entity.enums.AccountStatus accountStatus
    );
}
