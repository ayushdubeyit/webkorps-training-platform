package com.webkorps.platform.task.repository;

import com.webkorps.platform.task.entity.Task;
import com.webkorps.platform.task.entity.TaskPriority;
import com.webkorps.platform.task.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query(value = """
            SELECT DISTINCT t FROM Task t LEFT JOIN TaskAssignment a ON a.task = t AND a.active = true
            WHERE (:employeeId IS NULL OR a.employee.id = :employeeId)
              AND (:status IS NULL OR a.status = :status)
              AND (:priority IS NULL OR t.priority = :priority)
              AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))
            """, countQuery = """
            SELECT COUNT(DISTINCT t) FROM Task t LEFT JOIN TaskAssignment a ON a.task = t AND a.active = true
            WHERE (:employeeId IS NULL OR a.employee.id = :employeeId)
              AND (:status IS NULL OR a.status = :status)
              AND (:priority IS NULL OR t.priority = :priority)
              AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<Task> searchManagerTasks(@Param("employeeId") Long employeeId,
                                  @Param("status") TaskStatus status,
                                  @Param("priority") TaskPriority priority,
                                  @Param("search") String search,
                                  Pageable pageable);
}
