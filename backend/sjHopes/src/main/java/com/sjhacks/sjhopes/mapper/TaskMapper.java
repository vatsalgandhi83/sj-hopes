package com.sjhacks.sjhopes.mapper;

import com.sjhacks.sjhopes.models.dto.TaskRequestDto;
import com.sjhacks.sjhopes.models.dto.TaskResponseDto;
import com.sjhacks.sjhopes.models.entity.Task;

public class TaskMapper {

    public static Task mapToEntity(TaskRequestDto dto, Task entity) {
        if (entity == null) {
            entity = new Task();
        }
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setLocation(dto.getLocation());
        entity.setTaskDateTime(dto.getTaskDateTime());
        entity.setEstimatedDuration(dto.getEstimatedDuration());
        entity.setCompensationDetails(dto.getCompensationDetails());
        entity.setTaskContactName(dto.getTaskContactName());
        entity.setTaskContactPhone(dto.getTaskContactPhone());
        return entity;
    }

    public static TaskResponseDto mapToResponseDTO(Task entity) {
        if (entity == null) return null;

        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setLocation(entity.getLocation());
        dto.setStatus(entity.getStatus());
        dto.setClientId(entity.getClientId());
        dto.setLastUpdated(entity.getLastUpdated());
        dto.setTaskDateTime(entity.getTaskDateTime());
        dto.setEstimatedDuration(entity.getEstimatedDuration());
        dto.setCompensationDetails(entity.getCompensationDetails());
        dto.setTaskContactName(entity.getTaskContactName());
        dto.setTaskContactPhone(entity.getTaskContactPhone());
        return dto;
    }
}