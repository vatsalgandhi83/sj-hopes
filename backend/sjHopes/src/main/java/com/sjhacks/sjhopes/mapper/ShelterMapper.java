package com.sjhacks.sjhopes.mapper;

import com.sjhacks.sjhopes.models.dto.ShelterRequestDto;
import com.sjhacks.sjhopes.models.dto.ShelterResponseDto;
import com.sjhacks.sjhopes.models.entity.Shelter;

public class ShelterMapper {

    public static Shelter mapToEntity(ShelterRequestDto dto, Shelter entity) {
        // If entity is null (for creation), create a new one
        if (entity == null) {
            entity = new Shelter();
        }
        // Map fields from DTO to Entity
        entity.setName(dto.getName());
        entity.setAddressLine1(dto.getAddressLine1());
        entity.setAddressLine2(dto.getAddressLine2());
        entity.setCity(dto.getCity());
        entity.setState(dto.getState());
        entity.setZipCode(dto.getZipCode());
        entity.setLatitude(dto.getLatitude()); // Assumes not null due to validation
        entity.setLongitude(dto.getLongitude()); // Assumes not null
        entity.setTotalCapacity(dto.getTotalCapacity()); // Assumes not null
        entity.setCurrentAvailability(dto.getCurrentAvailability()); // Assumes not null
        entity.setShelterType(dto.getShelterType());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setOperatingOrganization(dto.getOperatingOrganization());
        entity.setDescription(dto.getDescription());
        if (dto.getAllowsPets() != null) entity.setAllowsPets(dto.getAllowsPets());
        if (dto.getAllowsPartner() != null) entity.setAllowsPartner(dto.getAllowsPartner());
        if (dto.getIsActive() != null) entity.setActive(dto.getIsActive());

        return entity;
    }

    // Map Entity to Response DTO (for sending data out)
    public static ShelterResponseDto mapToResponseDTO(Shelter entity) {
        if (entity == null) return null;

        ShelterResponseDto dto = new ShelterResponseDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAddressLine1(entity.getAddressLine1());
        dto.setAddressLine2(entity.getAddressLine2());
        dto.setCity(entity.getCity());
        dto.setState(entity.getState());
        dto.setZipCode(entity.getZipCode());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setTotalCapacity(entity.getTotalCapacity());
        dto.setCurrentAvailability(entity.getCurrentAvailability());
        dto.setShelterType(entity.getShelterType());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setOperatingOrganization(entity.getOperatingOrganization());
        dto.setDescription(entity.getDescription());
        dto.setAllowsPets(entity.isAllowsPets());
        dto.setAllowsPartner(entity.isAllowsPartner());
        dto.setLastUpdated(entity.getLastUpdated());
        dto.setActive(entity.isActive());

        return dto;
    }
}

