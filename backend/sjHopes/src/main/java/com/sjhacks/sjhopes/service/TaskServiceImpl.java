package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.models.entity.Task;
import com.sjhacks.sjhopes.models.enums.TaskStatus;
import com.sjhacks.sjhopes.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Task createTask(Task task) {
        log.info("Service: Creating new task: {}", task.getTitle());
        // Basic validation for required fields
        if (!StringUtils.hasText(task.getTitle())) { // Check if title is not null or empty
            log.error("Task creation failed: Title is missing.");
            // Throw an exception that controllers can handle (e.g., resulting in HTTP 400 Bad Request)
            throw new IllegalArgumentException("Task title cannot be empty.");
        }
        task.setStatus(TaskStatus.OPEN); // Ensure status is OPEN on creation
        task.setClientId(null); // Ensure not assigned on creation
        return taskRepository.save(task);
    }

    // Method to assign a task to a client (used by Caseworker)
    @Transactional
    public boolean assignTask(Long taskId, String clientId) {
        log.info("Service: Attempting assignment of task id: {} to client: {}", taskId, clientId);
        // Validate clientId
        if (!StringUtils.hasText(clientId)) {
            log.error("Task assignment failed for task id: {}. Client ID is missing or empty.", taskId);
            throw new IllegalArgumentException("Client ID cannot be empty for assignment.");
        }

        // Find the task
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            // Check if task is OPEN for assignment
            if (task.getStatus() == TaskStatus.OPEN) {
                // Update status and assign client ID
                task.setStatus(TaskStatus.ASSIGNED);
                task.setClientId(clientId);
                taskRepository.save(task); // Save changes
                log.info("Service: Task id: {} assigned successfully to client: {}", taskId, clientId);
                return true; // Success
            } else {
                log.warn("Service: Task assignment failed for task id: {}. Task status is not OPEN (current: {})", taskId, task.getStatus());
                return false; // Task not open
            }
        }
        log.warn("Service: Task assignment failed. Task not found for id: {}", taskId);
        return false; // Task not found
    }

    // Optional: Method to mark a task as complete
    @Transactional
    public boolean completeTask(Long taskId) {
        log.info("Service: Attempting completion of task id: {}", taskId);
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            // Business logic: Only ASSIGNED tasks can be marked as complete
            if (task.getStatus() == TaskStatus.ASSIGNED) {
                task.setStatus(TaskStatus.COMPLETED);
                // task.setClientId(null); // Optional: Clear client ID on completion? Decide based on requirements.
                taskRepository.save(task);
                log.info("Service: Task id: {} marked as COMPLETED", taskId);
                return true; // Success
            } else {
                log.warn("Service: Task completion failed for task id: {}. Task status is not ASSIGNED (current: {})", taskId, task.getStatus());
                return false; // Task not assigned
            }
        }
        log.warn("Service: Task completion failed. Task not found for id: {}", taskId);
        return false; // Task not found
    }

    // Method to update an existing task (used by Admin)
    @Transactional
    public Task updateTask(Long id, Task taskDetails) {
        log.info("Service: Attempting to update task id: {}", id);
        if (!StringUtils.hasText(taskDetails.getTitle())) {
            log.error("Task update failed for id: {}. Title is missing.", id);
            throw new IllegalArgumentException("Task title cannot be empty.");
        }

        // Find the existing task first
        return taskRepository.findById(id)
                .map(existingTask -> {
                    // Update fields from the details provided
                    existingTask.setTitle(taskDetails.getTitle());
                    existingTask.setDescription(taskDetails.getDescription());
                    existingTask.setLocation(taskDetails.getLocation());
                    existingTask.setTaskDateTime(taskDetails.getTaskDateTime());
                    existingTask.setEstimatedDuration(taskDetails.getEstimatedDuration());
                    existingTask.setCompensationDetails(taskDetails.getCompensationDetails());
                    existingTask.setTaskContactName(taskDetails.getTaskContactName());
                    existingTask.setTaskContactPhone(taskDetails.getTaskContactPhone());
                    // Generally, don't allow status/assignment changes via this generic update method
                    // Use specific methods like assignTask/completeTask for status changes.
                    log.info("Service: Updating task id: {}", id);
                    return taskRepository.save(existingTask); // Save the updated task
                })
                // If task is not found, throw an exception
                .orElseThrow(() -> {
                    log.error("Update failed. Task not found for id: {}", id);
                    // Using a RuntimeException subclass is common
                    return new RuntimeException("Task not found with id " + id);
                });
    }


    // Method to delete a task (used by Admin)
    @Transactional
    public boolean deleteTask(Long id) {
        log.info("Service: Attempting to delete task id: {}", id);
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            log.info("Service: Task deleted successfully: {}", id);
            return true;
        }
        log.warn("Service: Deletion failed. Task not found for id: {}", id);
        return false;
    }
}
