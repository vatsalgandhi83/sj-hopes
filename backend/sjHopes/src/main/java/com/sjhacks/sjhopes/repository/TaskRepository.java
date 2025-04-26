package com.sjhacks.sjhopes.repository;

import com.sjhacks.sjhopes.models.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
