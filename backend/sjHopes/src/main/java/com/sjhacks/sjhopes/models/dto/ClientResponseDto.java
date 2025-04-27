package com.sjhacks.sjhopes.models.dto;

import com.sjhacks.sjhopes.models.enums.ClientStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClientResponseDto {

    private Long id;
    private String pseudonym;
    private ClientStatus status;
    private Long currentShelterId;
    private String currentShelterName;
    private LocalDateTime registrationDate;
    private LocalDateTime lastActivityDate;
    private String caseworkerNotes;
}
