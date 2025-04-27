package com.sjhacks.sjhopes.models.dto;

import com.sjhacks.sjhopes.models.enums.ShelterType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShelterTypeSummaryDto {
    private ShelterType shelterType;
    private long shelterCount;
    private long totalCapacity;
    private long currentAvailability;
    private double occupancyRate;
}
