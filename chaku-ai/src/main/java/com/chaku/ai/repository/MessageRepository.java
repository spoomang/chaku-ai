package com.chaku.ai.repository;

import com.chaku.ai.entity.MessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    @Query("SELECT m FROM MessageEntity m WHERE m.eventId = :eventId ORDER BY m.createTime ASC")
    Page<MessageEntity> findByEventId(@Param("eventId") UUID eventId, Pageable pageable);
}
