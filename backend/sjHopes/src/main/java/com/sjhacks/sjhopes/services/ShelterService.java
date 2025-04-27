// src/main/java/com/sjhacks/sjhopes/service/ShelterService.java
package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.models.entity.Shelter;
import com.sjhacks.sjhopes.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;

    @Autowired
    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    public List<Shelter> getAllShelters(String type, String city, String state, Boolean available) {
        List<Shelter> shelters = shelterRepository.findAll();
        return shelters.stream()
                .filter(shelter -> type == null || shelter.getShelterType().name().equalsIgnoreCase(type))
                .filter(shelter -> city == null || shelter.getCity().equalsIgnoreCase(city))
                .filter(shelter -> state == null || shelter.getState().equalsIgnoreCase(state))
                .filter(shelter -> available == null || (available && shelter.getCurrentAvailability() > 0))
                .collect(Collectors.toList());
    }

    public Optional<Shelter> getShelterById(Long id) {
        return shelterRepository.findById(id);
    }

    public Shelter createShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    public Optional<Shelter> updateShelter(Long id, Shelter updatedShelter) {
        return shelterRepository.findById(id)
                .map(existingShelter -> {
                    updatedShelter.setId(id); // Ensure the ID is set for updating
                    return shelterRepository.save(updatedShelter);
                });
    }

    public void deleteShelter(Long id) {
        shelterRepository.deleteById(id);
    }
}