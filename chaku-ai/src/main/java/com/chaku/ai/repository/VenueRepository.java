package com.chaku.ai.repository;

import com.chaku.ai.entity.VenueEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VenueRepository extends JpaRepository<VenueEntity, UUID> {

    Page<VenueEntity> findByNameContainingIgnoreCaseAndAddressContainingIgnoreCase(
            String name, String address, Pageable pageable);
}
