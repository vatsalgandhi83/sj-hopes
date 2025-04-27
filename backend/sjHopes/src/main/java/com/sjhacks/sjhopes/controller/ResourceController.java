package com.sjhacks.sjhopes.controller;

import com.sjhacks.sjhopes.mapper.ShelterMapper;
import com.sjhacks.sjhopes.models.dto.ShelterReserveRequestDto;
import com.sjhacks.sjhopes.models.dto.ShelterResponseDto;
import com.sjhacks.sjhopes.models.entity.Shelter;
import com.sjhacks.sjhopes.models.enums.ShelterType;
import com.sjhacks.sjhopes.service.ResourceService;
import jakarta.persistence.EntityNotFoundException;
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
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Slf4j
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // GET /api/shelters
    @GetMapping("/shelters")
    public List<ShelterResponseDto> getAllActiveShelters() {
        log.info("CONTROLLER: GET /api/shelters (active) invoked");
        // Call the service method for active shelters
        List<Shelter> shelters = resourceService.getAllActiveShelters();
        // Map results to Response DTOs
        return shelters.stream()
                .map(ShelterMapper::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // GET /api/shelters/search?allowsPets=true&shelterType=TINY_HOME...
    @GetMapping("/shelters/search")
    public List<ShelterResponseDto> searchSheltersByCriteria(
            @RequestParam(required = false) Boolean allowsPets,
            @RequestParam(required = false) Boolean allowsPartner,
            @RequestParam(required = false) ShelterType shelterType,
            @RequestParam(required = false) Boolean isActive // User can override active status here
    ) {
        log.info("CONTROLLER: GET /api/shelters/search invoked with filters - allowsPets: {}, allowsPartner: {}, shelterType: {}, isActive: {}",
                allowsPets, allowsPartner, shelterType, isActive);

        // Call the service method for searching with criteria
        List<Shelter> shelters = resourceService.findSheltersByCriteria(allowsPets, allowsPartner, shelterType, isActive);

        // Map results to Response DTOs
        return shelters.stream()
                .map(ShelterMapper::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // GET /api/shelters/{id} - Return single Response DTO
    @GetMapping("/shelters/{id}")
    public ResponseEntity<ShelterResponseDto> getShelterById(@PathVariable Long id) {
        return resourceService.getShelterById(id)
                .map(ShelterMapper::mapToResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/shelters/{id}/reserve")
    public ResponseEntity<Void> reserveShelter(@PathVariable Long id, @Valid @RequestBody ShelterReserveRequestDto reservationRequest) {
        try {
            boolean success = resourceService.reserveShelterBed(id, reservationRequest.getClientId());
            if (success) {
                return ResponseEntity.ok().build();
            } else {
                // Failure could be due to various reasons checked in the service
                log.warn("CONTROLLER: Reservation failed for shelter id: {} / client id: {}", id, reservationRequest.getClientId());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation failed: Shelter/client not found, no availability, or client link failed.");
            }
        } catch (EntityNotFoundException enfe) {
            log.warn("CONTROLLER: Reservation failed for shelter {}: {}", id, enfe.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, enfe.getMessage());
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception e) {
            log.error("CONTROLLER: Unexpected error during reservation for shelter id: {} / client id: {}", id, reservationRequest.getClientId(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing reservation", e);
        }
    }
}
