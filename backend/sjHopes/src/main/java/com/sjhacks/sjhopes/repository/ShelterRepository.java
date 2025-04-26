package com.sjhacks.sjhopes.repository;

import com.sjhacks.sjhopes.models.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {

}
