package com.chaku.ai.model.event;

import java.util.UUID;

public record EventMemberDetailResponse(
        UUID eventId,
        UUID groupId,
        UUID memberId,
        String action,
        String status,
        String memberName,
        String email,
        String mobile
) {}
