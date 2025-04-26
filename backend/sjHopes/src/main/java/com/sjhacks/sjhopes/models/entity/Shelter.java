package com.sjhacks.sjhopes.models.entity;

import com.sjhacks.sjhopes.models.enums.ShelterType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity(name = "shelters")
@Data
@NoArgsConstructor
public class Shelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String addressLine1;

    @Column(nullable = true) // Line 2 is optional
    private String addressLine2;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false) // State abbreviation
    private String state;

    @Column(nullable = false)
    private String zipCode;

    // Keep Latitude/Longitude for mapping
    @Column(nullable = false) // Should ideally always have coords if address exists
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    // Capacity and Availability
    @Column(nullable = false)
    private int totalCapacity;

    @Column(nullable = false)
    private int currentAvailability;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // mm
    private ShelterType shelterType;

    // Contact and Operator Info
    @Column(nullable = true) // Renamed from contactInfo
    private String phone;

    @Column(nullable = true)
    private String email;

    @Column(nullable = true)
    private String operatingOrganization; // e.g., "HomeFirst", "City of San Jose"

    // Operational Details
    @Column(columnDefinition = "TEXT", nullable = true) // Use TEXT for potentially long descriptions
    private String description;

    // Restrictions / Allowances
    @Column(nullable = false) // Make boolean explicit non-null
    private boolean allowsPets = false; // Default to false unless specified

    @Column(nullable = false)
    private boolean allowsPartner = false; // Default to false unless specified

    // Metadata
    @UpdateTimestamp // Automatically updates when the entity is updated via Hibernate
    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @Column(nullable = false)
    private boolean isActive = true; // Default to active when created

}
