package com.webkorps.platform.task.repository;

import com.webkorps.platform.task.entity.TaskRemark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRemarkRepository extends JpaRepository<TaskRemark, Long> {
    List<TaskRemark> findAllByAssignmentIdOrderByCreatedAtAscIdAsc(Long assignmentId);
}
