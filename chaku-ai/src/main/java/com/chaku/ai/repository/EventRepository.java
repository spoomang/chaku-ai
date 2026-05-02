package com.chaku.ai.repository;

import com.chaku.ai.entity.EventEntity;
import com.chaku.ai.model.event.EventDetailResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, Long> {

    Optional<EventEntity> findByEventId(UUID eventId);

    @Query("SELECT new com.chaku.ai.model.event.EventDetailResponse(" +
           "e.eventId, e.groupId, e.venueId, e.createdBy, e.name, e.type, e.status, e.params, " +
           "e.totalCost, e.currency, e.noOfParticipants, e.description, e.startDateTime, e.endDateTime, " +
           "e.venue.name, e.venue.address, e.venue.latitude, e.venue.longitude, null, null) " +
           "FROM EventEntity e LEFT JOIN e.venue WHERE e.groupId = :groupId")
    List<EventDetailResponse> findEventDetailsByGroupId(@Param("groupId") UUID groupId);

    @Query("SELECT new com.chaku.ai.model.event.EventDetailResponse(" +
           "e.eventId, e.groupId, e.venueId, e.createdBy, e.name, e.type, e.status, e.params, " +
           "e.totalCost, e.currency, e.noOfParticipants, e.description, e.startDateTime, e.endDateTime, " +
           "e.venue.name, e.venue.address, e.venue.latitude, e.venue.longitude, null, null) " +
           "FROM EventEntity e LEFT JOIN e.venue " +
           "WHERE (:groupId IS NULL OR e.groupId = :groupId) " +
           "AND (:venueId IS NULL OR e.venueId = :venueId) " +
           "AND (:status IS NULL OR e.status = :status) " +
           "AND (:type IS NULL OR e.type = :type) " +
           "AND (:venueName IS NULL OR e.venue.name LIKE %:venueName%)")
    List<EventDetailResponse> searchEventDetails(
            @Param("groupId") UUID groupId,
            @Param("venueId") UUID venueId,
            @Param("status") String status,
            @Param("type") String type,
            @Param("venueName") String venueName);
}
