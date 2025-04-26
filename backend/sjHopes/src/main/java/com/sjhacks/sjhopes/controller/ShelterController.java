// src/main/java/com/sjhacks/sjhopes/controller/ShelterController.java
package com.sjhacks.sjhopes.controller;

import com.sjhacks.sjhopes.models.entity.Shelter;
import com.sjhacks.sjhopes.service.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    private final ShelterService shelterService;

    @Autowired
    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @GetMapping
    public ResponseEntity<List<Shelter>> getAllShelters(@RequestParam(required = false) String type,
                                                        @RequestParam(required = false) String city,
                                                        @RequestParam(required = false) String state,
                                                        @RequestParam(required = false) Boolean available) {
        List<Shelter> shelters = shelterService.getAllShelters(type, city, state, available);
        return new ResponseEntity<>(shelters, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shelter> getShelterById(@PathVariable Long id) {
        Optional<Shelter> shelter = shelterService.getShelterById(id);
        return shelter.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Shelter> createShelter(@RequestBody Shelter shelter) {
        Shelter createdShelter = shelterService.createShelter(shelter);
        return new ResponseEntity<>(createdShelter, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shelter> updateShelter(@PathVariable Long id, @RequestBody Shelter updatedShelter) {
        Optional<Shelter> existingShelter = shelterService.updateShelter(id, updatedShelter);
        return existingShelter.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShelter(@PathVariable Long id) {
        shelterService.deleteShelter(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}