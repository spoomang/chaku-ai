package com.chaku.ai.model.event;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record CreateEventRequest(
        UUID groupId,
        String venueId,
        UUID creatorId,
        String name,
        String type,
        Map<String, Object> params,
        Integer totalCost,
        String currency,
        Integer noOfParticipants,
        String description,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime
) {}
