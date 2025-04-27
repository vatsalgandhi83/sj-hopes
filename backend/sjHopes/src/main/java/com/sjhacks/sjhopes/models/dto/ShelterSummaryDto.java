package com.sjhacks.sjhopes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShelterSummaryDto {
    private long totalShelters;
    private long activeShelters;
    private long inactiveShelters;
    private long totalCapacity;
    private long currentAvailability;
    private double overallOccupancyRate; // Calculated: (TotalCapacity - CurrentAvailability) / TotalCapacity
    private long sheltersAllowingPets;   // Count of active shelters allowing pets
    private long sheltersAllowingPartners; // Count of active shelters allowing partners
}
