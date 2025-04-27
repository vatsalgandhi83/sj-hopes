package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.models.entity.Shelter;
import com.sjhacks.sjhopes.models.enums.ShelterType;
import com.sjhacks.sjhopes.repository.ShelterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ShelterRepository shelterRepository;

    // --- Method for the simple GET /api/shelters ---
    public List<Shelter> getAllActiveShelters() {
        return shelterRepository.findAllByIsActive(true);
    }

    @Override
    public List<Shelter> findSheltersByCriteria(Boolean allowsPets, Boolean allowsPartner, ShelterType shelterType, Boolean isActive) {
        log.info("Service: Finding shelters with criteria - allowsPets: {}, allowsPartner: {}, shelterType: {}, isActive: {}",
                allowsPets, allowsPartner, shelterType, isActive);
        return shelterRepository.findSheltersByCriteria(allowsPets, allowsPartner, shelterType, isActive);
    }

    // Method to get a single shelter by its ID
    public Optional<Shelter> getShelterById(Long id) {
        return shelterRepository.findById(id);
    }

    // Method to save/update a shelter (used by Admin)
    // Transactional needed as it modifies data
    @Transactional
    public Shelter saveShelter(Shelter shelter) {
        log.info("Service: Saving shelter id: {} name: {}", shelter.getId(), shelter.getName());
        if (shelter.getCurrentAvailability() < 0) {
            shelter.setCurrentAvailability(0);
        }
        if (shelter.getTotalCapacity() < 0) {
            shelter.setTotalCapacity(0);
        }
        if (shelter.getCurrentAvailability() > shelter.getTotalCapacity()) {
            shelter.setCurrentAvailability(shelter.getTotalCapacity());
            log.warn("Corrected availability for shelter {} - cannot exceed total capacity.", shelter.getName());
        }
        return shelterRepository.save(shelter);
    }

    // Method to handle the reservation logic
    // Transactional is crucial here to ensure the check and update happen together
    @Transactional
    public boolean reserveShelterBed(Long shelterId) {
        log.info("Service: Attempting reservation for shelter id: {}", shelterId);
        // Find the shelter by ID
        Optional<Shelter> shelterOpt = shelterRepository.findById(shelterId);

        // Check if shelter exists
        if (shelterOpt.isPresent()) {
            Shelter shelter = shelterOpt.get();
            // Check if beds are available
            if (shelter.getCurrentAvailability() > 0) {
                // Decrease availability by 1
                shelter.setCurrentAvailability(shelter.getCurrentAvailability() - 1);
                // Save the updated shelter record back to the database
                shelterRepository.save(shelter);
                log.info("Service: Reservation successful for shelter id: {}. New availability: {}", shelterId, shelter.getCurrentAvailability());
                return true; // Indicate success
            } else {
                log.warn("Service: Reservation failed for shelter id: {}. No availability.", shelterId);
                return false; // Indicate failure: No availability
            }
        }
        log.warn("Service: Reservation failed. Shelter not found for id: {}", shelterId);
        return false; // Indicate failure: Shelter not found
    }

    // Method to delete a shelter (used by Admin)
    // Transactional needed as it modifies data
    @Transactional
    public boolean deleteShelter(Long id) {
        log.info("Service: Attempting to delete shelter id: {}", id);
        // Check if the shelter exists before trying to delete
        if (shelterRepository.existsById(id)) {
            shelterRepository.deleteById(id);
            log.info("Service: Shelter deleted successfully: {}", id);
            return true; // Indicate success
        }
        log.warn("Service: Deletion failed. Shelter not found for id: {}", id);
        return false; // Indicate failure: Not found
    }
}
