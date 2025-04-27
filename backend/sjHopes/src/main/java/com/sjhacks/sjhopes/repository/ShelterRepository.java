package com.sjhacks.sjhopes.repository;

import com.sjhacks.sjhopes.models.dto.ShelterTypeSummaryDto;
import com.sjhacks.sjhopes.models.entity.Shelter;
import com.sjhacks.sjhopes.models.enums.ShelterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    // Method for the simple GET /api/shelters endpoint - find active shelters
    List<Shelter> findAllByIsActive(boolean isActive); // Simple derived query

    @Query("SELECT s FROM shelters s WHERE " +
            "(:allowsPets IS NULL OR s.allowsPets = :allowsPets) AND " +
            "(:allowsPartner IS NULL OR s.allowsPartner = :allowsPartner) AND " +
            "(:shelterType IS NULL OR s.shelterType = :shelterType) AND " +
            "(:isActive IS NULL OR s.isActive = :isActive)")
    List<Shelter> findSheltersByCriteria(
            @Param("allowsPets") Boolean allowsPets,
            @Param("allowsPartner") Boolean allowsPartner,
            @Param("shelterType") ShelterType shelterType,
            @Param("isActive") Boolean isActive
    );

    // --- New Methods for Analytics ---
    long countByIsActive(boolean isActive);

    long countByAllowsPetsAndIsActive(boolean allowsPets, boolean isActive);

    long countByAllowsPartnerAndIsActive(boolean allowsPartner, boolean isActive);

    // Use JPQL SUM aggregate function - Ensure return type matches (Long or handle null)
    @Query("SELECT SUM(s.totalCapacity) FROM shelters s WHERE s.isActive = true")
    Long getTotalActiveCapacity(); // Can return null if no active shelters

    @Query("SELECT SUM(s.currentAvailability) FROM shelters s WHERE s.isActive = true")
    Long getCurrentActiveAvailability(); // Can return null

    // Query to group by ShelterType and calculate aggregates
    // Using constructor expression to map results directly to DTO
    @Query("SELECT new com.sjhacks.sjhopes.models.dto.ShelterTypeSummaryDto(" +
            "s.shelterType, COUNT(s), SUM(s.totalCapacity), SUM(s.currentAvailability), 0.0) " + // Placeholder for rate
            "FROM shelters s WHERE s.isActive = true GROUP BY s.shelterType")
    List<ShelterTypeSummaryDto> getActiveShelterTypeSummaries();
}
