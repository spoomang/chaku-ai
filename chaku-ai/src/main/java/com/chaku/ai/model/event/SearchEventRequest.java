package com.chaku.ai.model.event;

import java.util.UUID;

public record SearchEventRequest(
        int pageNumber,
        int pageSize,
        UUID groupId,
        UUID venueId,
        String status,
        String type,
        String venueName,
        boolean getCountOfParticipants
) {}
