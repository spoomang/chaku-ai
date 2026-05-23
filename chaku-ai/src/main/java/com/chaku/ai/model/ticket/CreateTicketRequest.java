package com.chaku.ai.model.ticket;

import java.util.Map;

public record CreateTicketRequest(
        Long formId,
        Long submittedBy,
        Map<String, Object> data
) {}
