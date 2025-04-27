package com.sjhacks.sjhopes.repository;

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
}
