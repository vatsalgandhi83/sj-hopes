package com.sjhacks.sjhopes.models.dto;

import com.sjhacks.sjhopes.models.enums.ShelterType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ShelterRequestDto {

    @NotBlank(message = "Shelter name cannot be blank")
    @Size(max = 255, message = "Shelter name too long")
    private String name;

    @NotBlank(message = "Address line 1 cannot be blank")
    private String addressLine1;

    private String addressLine2; // Optional

    @NotBlank(message = "City cannot be blank")
    private String city;

    @NotBlank(message = "State cannot be blank")
    private String state;

    @NotBlank(message = "Zip code cannot be blank")
    private String zipCode;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Total capacity is required")
    @Min(value = 0, message = "Total capacity cannot be negative")
    private Integer totalCapacity;

    @NotNull(message = "Current availability is required")
    @Min(value = 0, message = "Current availability cannot be negative")
    private Integer currentAvailability;

    private ShelterType shelterType;

    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}$", message = "Invalid phone number format")
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    private String operatingOrganization;

    private String description;

    private Boolean allowsPets;

    private Boolean allowsPartner;

    private Boolean isActive;
}
