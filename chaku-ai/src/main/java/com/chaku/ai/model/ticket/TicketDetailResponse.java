package com.chaku.ai.model.ticket;

import java.time.LocalDateTime;
import java.util.Map;

public record TicketDetailResponse(
        Long id,
        Long formId,
        Long submittedBy,
        String status,
        Map<String, Object> data,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
