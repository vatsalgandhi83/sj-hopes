package com.sjhacks.sjhopes.models.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShelterReserveRequestDto {

    @NotNull(message = "Client ID is required for reservation")
    private Long clientId;
}
