package com.chaku.ai.repository;

import com.chaku.ai.entity.EventMemberEntity;
import com.chaku.ai.model.event.EventMemberDetailResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface EventMemberRepository extends JpaRepository<EventMemberEntity, Long> {

    @Query("SELECT new com.chaku.ai.model.event.EventMemberDetailResponse(" +
           "em.eventId, em.groupId, em.memberId, em.action, em.status, " +
           "em.user.name, em.user.email, em.user.mobile) " +
           "FROM EventMemberEntity em WHERE em.eventId = :eventId")
    List<EventMemberDetailResponse> findMemberDetailsByEventId(@Param("eventId") UUID eventId);

    @Query("SELECT em.eventId, COUNT(em) FROM EventMemberEntity em WHERE em.eventId IN :eventIds GROUP BY em.eventId")
    List<Object[]> countMembersByEventIds(@Param("eventIds") List<UUID> eventIds);
}
