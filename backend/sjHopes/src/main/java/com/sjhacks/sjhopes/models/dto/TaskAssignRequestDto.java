package com.sjhacks.sjhopes.models.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskAssignRequestDto {

    @NotNull(message = "Client ID cannot be null")
    private Long clientId;
}
