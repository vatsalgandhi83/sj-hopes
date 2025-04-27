package com.sjhacks.sjhopes.models.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskAssignRequestDto {

    @NotBlank(message = "Client ID cannot be blank")
    private String clientId;
}
