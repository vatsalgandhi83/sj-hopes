package com.sjhacks.sjhopes.mapper;

import com.sjhacks.sjhopes.models.dto.ClientRequestDto;
import com.sjhacks.sjhopes.models.dto.ClientResponseDto;
import com.sjhacks.sjhopes.models.entity.Client;
import com.sjhacks.sjhopes.models.enums.ClientStatus;

public class ClientMapper {

    public static Client mapToEntity(ClientRequestDto dto, Client entity) {
        if (entity == null) {
            entity = new Client();
            entity.setStatus(ClientStatus.SEEKING_PLACEMENT); // Default status on creation
        }
        entity.setName(dto.getName());
        entity.setCaseworkerNotes(dto.getCaseworkerNotes());
        return entity;
    }

    public static ClientResponseDto mapToResponseDTO(Client entity) {
        if (entity == null) return null;
        ClientResponseDto dto = new ClientResponseDto();
        dto.setId(entity.getId());
        dto.setPseudonym(entity.getName());
        dto.setStatus(entity.getStatus());
        // Safely get shelter ID and name if shelter is not null
        if (entity.getCurrentShelter() != null) {
            dto.setCurrentShelterId(entity.getCurrentShelter().getId());
            dto.setCurrentShelterName(entity.getCurrentShelter().getName()); // Add name
        } else {
            dto.setCurrentShelterId(null);
            dto.setCurrentShelterName(null);
        }
        dto.setRegistrationDate(entity.getRegistrationDate());
        dto.setLastActivityDate(entity.getLastActivityDate());
        dto.setCaseworkerNotes(entity.getCaseworkerNotes());
        return dto;
    }

}
