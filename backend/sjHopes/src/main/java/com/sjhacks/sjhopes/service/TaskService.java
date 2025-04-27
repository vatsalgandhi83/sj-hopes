package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.models.entity.Task;

import java.util.List;
import java.util.Optional;

public interface TaskService {

    List<Task> getAllTasks();

    Optional<Task> getTaskById(Long id);

    Task createTask(Task task);

    boolean assignTask(Long taskId, Long clientId);

    boolean completeTask(Long taskId);

    Task updateTask(Long id, Task taskDetails);

    boolean deleteTask(Long id);
}
