package com.sjhacks.sjhopes.models.dto;

import com.sjhacks.sjhopes.models.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskResponseDto {

    private Long id;
    private String title;
    private String description;
    private String location;
    private TaskStatus status;
    private String clientId; // Include assigned client ID if present
    private LocalDateTime lastUpdated;
    private LocalDateTime taskDateTime;
    private String estimatedDuration;
    private String compensationDetails;
    private String taskContactName;
    private String taskContactPhone;
}
