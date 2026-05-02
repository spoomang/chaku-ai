package com.chaku.ai.model.message;

import java.util.UUID;

public record SendMessageRequest(UUID groupId, UUID eventId, UUID memberId, String name, String content) {}
