package com.chaku.ai.model.message;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageResponse(
        UUID eventId,
        UUID groupId,
        UUID memberId,
        String name,
        String content,
        LocalDateTime createTime,
        LocalDateTime updateTime
) {}
