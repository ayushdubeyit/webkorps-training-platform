package com.webkorps.platform.task.repository;

import com.webkorps.platform.task.entity.TaskAssignment;
import com.webkorps.platform.task.entity.TaskPriority;
import com.webkorps.platform.task.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    @Query(value = """
            SELECT a FROM TaskAssignment a JOIN a.task t
            WHERE a.employee.id = :employeeId AND a.active = true
              AND (:status IS NULL OR a.status = :status)
              AND (:priority IS NULL OR t.priority = :priority)
              AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY t.createdAt DESC, t.id DESC
            """, countQuery = """
            SELECT COUNT(a) FROM TaskAssignment a JOIN a.task t
            WHERE a.employee.id = :employeeId AND a.active = true
              AND (:status IS NULL OR a.status = :status)
              AND (:priority IS NULL OR t.priority = :priority)
              AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<TaskAssignment> findEmployeeTasks(@Param("employeeId") Long employeeId,
                                           @Param("status") TaskStatus status,
                                           @Param("priority") TaskPriority priority,
                                           @Param("search") String search,
                                           Pageable pageable);
    Optional<TaskAssignment> findByTaskIdAndEmployeeEmailAndActiveTrue(Long taskId, String email);
    List<TaskAssignment> findAllByTaskId(Long taskId);
    List<TaskAssignment> findAllByTaskIdAndActiveTrueOrderByIdAsc(Long taskId);
    boolean existsByEmployeeIdAndActiveTrue(Long employeeId);
}
