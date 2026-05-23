package com.chaku.ai.model.ticket;

import java.time.LocalDateTime;

public record TicketSummaryResponse(
        Long id,
        Long formId,
        Long submittedBy,
        String status,
        LocalDateTime createdAt
) {}
