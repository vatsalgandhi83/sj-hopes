package com.sjhacks.sjhopes.service;

import com.sjhacks.sjhopes.models.entity.Shelter;
import com.sjhacks.sjhopes.models.enums.ShelterType;

import java.util.List;
import java.util.Optional;

public interface ResourceService {

    List<Shelter> getAllActiveShelters();

    List<Shelter> findSheltersByCriteria(Boolean allowsPets, Boolean allowsPartner, ShelterType shelterType, Boolean isActive);

    Optional<Shelter> getShelterById(Long id);

    Shelter saveShelter(Shelter shelter);

    boolean reserveShelterBed(Long shelterId, Long clientId);

    boolean deleteShelter(Long id);

}
