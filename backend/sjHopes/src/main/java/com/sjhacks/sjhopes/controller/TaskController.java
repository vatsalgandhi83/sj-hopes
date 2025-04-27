package com.sjhacks.sjhopes.controller;

import com.sjhacks.sjhopes.mapper.TaskMapper;
import com.sjhacks.sjhopes.models.dto.TaskAssignRequestDto;
import com.sjhacks.sjhopes.models.dto.TaskResponseDto;
import com.sjhacks.sjhopes.service.TaskService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
@Slf4j
public class TaskController {

    @Autowired
    private TaskService taskService;

    // GET /api/tasks - Return list of Response DTOs
    @GetMapping
    public List<TaskResponseDto> getAllTasks() {
        log.info("CONTROLLER: GET /api/tasks invoked");
        return taskService.getAllTasks().stream()
                .map(TaskMapper::mapToResponseDTO) // Use mapper
                .collect(Collectors.toList());
    }

    // GET /api/tasks/{id} - Return single Response DTO
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(TaskMapper::mapToResponseDTO) // Map to DTO
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/tasks/{id}/assign - Use specific Request DTO and @Valid
    @PutMapping("/{id}/assign")
    public ResponseEntity<Void> assignTask(@PathVariable Long id,
                                           @Valid @RequestBody TaskAssignRequestDto assignRequest) {

        try {
            // Extract clientId from the validated DTO
            boolean success = taskService.assignTask(id, assignRequest.getClientId());
            if (success) {
                return ResponseEntity.ok().build();
            } else {
                log.warn("CONTROLLER: Assignment failed for task id: {}", id);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignment failed: Task not found or not in OPEN status.");
            }
        } catch (IllegalArgumentException e) {
            log.error("CONTROLLER: Task assignment failed validation: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (ResponseStatusException rse) { throw rse; }
        catch (Exception e) {
            log.error("CONTROLLER: Error assigning task id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error assigning task", e);
        }
    }

    // PUT /api/tasks/{id}/complete - No DTO needed for this action
    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> completeTask(@PathVariable Long id) {
        try {
            boolean success = taskService.completeTask(id);
            if (success) {
                return ResponseEntity.ok().build();
            } else {
                log.warn("CONTROLLER: Completion failed for task id: {}", id);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Completion failed: Task not found or not in ASSIGNED status.");
            }
        } catch (ResponseStatusException rse) { throw rse; }
        catch (Exception e) {
            log.error("CONTROLLER: Error completing task id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error completing task", e);
        }
    }

}
