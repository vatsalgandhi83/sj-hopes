package com.sjhacks.sjhopes.models.dto;

import com.sjhacks.sjhopes.models.enums.ShelterType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShelterResponseDto {

    private Long id;
    private String name;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String zipCode;
    private double latitude;
    private double longitude;
    private int totalCapacity;
    private int currentAvailability;
    private ShelterType shelterType;
    private String phone;
    private String email;
    private String operatingOrganization;
    private String description;
    private boolean allowsPets;
    private boolean allowsPartner;
    private LocalDateTime lastUpdated;
    private boolean isActive;
}
