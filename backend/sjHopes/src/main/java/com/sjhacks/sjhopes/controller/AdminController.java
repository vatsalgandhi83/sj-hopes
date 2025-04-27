package com.sjhacks.sjhopes.controller;

import com.sjhacks.sjhopes.mapper.ShelterMapper;
import com.sjhacks.sjhopes.mapper.TaskMapper;
import com.sjhacks.sjhopes.models.dto.ShelterRequestDto;
import com.sjhacks.sjhopes.models.dto.ShelterResponseDto;
import com.sjhacks.sjhopes.models.dto.TaskRequestDto;
import com.sjhacks.sjhopes.models.dto.TaskResponseDto;
import com.sjhacks.sjhopes.models.entity.Shelter;
import com.sjhacks.sjhopes.models.entity.Task;
import com.sjhacks.sjhopes.service.ResourceService;
import com.sjhacks.sjhopes.service.TaskService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Slf4j
public class AdminController {

    @Autowired
    private ResourceService resourceService;
    @Autowired
    private TaskService taskService;

    @PostMapping("/shelters")
    public ResponseEntity<ShelterResponseDto> addShelter(@Valid @RequestBody ShelterRequestDto shelterRequest) {
        // SECURITY NOTE: Protect this endpoint
        log.info("ADMIN CONTROLLER: POST /api/admin/shelters");
        try {
            // 1. Map Request DTO to Entity
            Shelter shelterToCreate = ShelterMapper.mapToEntity(shelterRequest, null); // null entity for creation
            // 2. Call service to save entity
            Shelter savedShelter = resourceService.saveShelter(shelterToCreate);
            // 3. Map saved Entity to Response DTO
            ShelterResponseDto responseDto = ShelterMapper.mapToResponseDTO(savedShelter);
            // 4. Return 201 Created with Response DTO
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            log.error("ADMIN CONTROLLER: Error adding shelter", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error adding shelter", e);
        }
    }

    @PutMapping("/shelters/{id}")
    public ResponseEntity<ShelterResponseDto> updateShelter(@PathVariable Long id,
                                                            @Valid @RequestBody ShelterRequestDto shelterRequest) {
        // SECURITY NOTE: Protect this endpoint
        log.info("ADMIN CONTROLLER: PUT /api/admin/shelters/{}", id);
        try {
            // 1. Find existing entity (throws 404 if not found by service or check here)
            Shelter existingShelter = resourceService.getShelterById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shelter not found with id " + id));

            // 2. Map Request DTO onto existing Entity
            Shelter shelterToUpdate = ShelterMapper.mapToEntity(shelterRequest, existingShelter);
            // No need to set ID again, it's already on existingShelter

            // 3. Call service to save updated entity
            Shelter updatedShelter = resourceService.saveShelter(shelterToUpdate);

            // 4. Map updated Entity to Response DTO
            ShelterResponseDto responseDto = ShelterMapper.mapToResponseDTO(updatedShelter);

            // 5. Return 200 OK with Response DTO
            return ResponseEntity.ok(responseDto);
            // @Valid handles validation errors (400) automatically
        } catch (ResponseStatusException rse) { throw rse; }
        catch (Exception e) {
            log.error("ADMIN CONTROLLER: Error updating shelter id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating shelter", e);
        }
    }

    @DeleteMapping("/shelters/{id}")
    public ResponseEntity<Void> deleteShelter(@PathVariable Long id) {
        // SECURITY NOTE: Protect this endpoint
        log.info("ADMIN CONTROLLER: DELETE /api/admin/shelters/{}", id);
        boolean deleted = resourceService.deleteShelter(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shelter not found with id " + id);
        }
    }

    // --- Task Admin CRUD ---

    @PostMapping("/tasks")
    public ResponseEntity<TaskResponseDto> addTask(@Valid @RequestBody TaskRequestDto taskRequest) {
        log.info("ADMIN CONTROLLER: POST /api/admin/tasks");
        try {
            Task taskToCreate = TaskMapper.mapToEntity(taskRequest, null);
            Task createdTask = taskService.createTask(taskToCreate); // Service sets default status etc.
            TaskResponseDto responseDto = TaskMapper.mapToResponseDTO(createdTask);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (IllegalArgumentException e) { // Catch specific validation errors from service if needed
            log.error("ADMIN CONTROLLER: Task creation failed validation: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            log.error("ADMIN CONTROLLER: Error adding task", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error adding task", e);
        }
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long id,
                                                      @Valid @RequestBody TaskRequestDto taskRequest) {
        try {
            Task taskToUpdate = TaskMapper.mapToEntity(taskRequest, null);
            Task updatedTask = taskService.updateTask(id, taskToUpdate);
            TaskResponseDto responseDto = TaskMapper.mapToResponseDTO(updatedTask);
            return ResponseEntity.ok(responseDto);
        } catch (IllegalArgumentException e) {
            log.error("ADMIN CONTROLLER: Task update failed validation: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (RuntimeException e) {
            log.error("ADMIN CONTROLLER: Task update failed: {}", e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("not found")) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating task", e);
        }
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found with id " + id);
        }
    }
}
