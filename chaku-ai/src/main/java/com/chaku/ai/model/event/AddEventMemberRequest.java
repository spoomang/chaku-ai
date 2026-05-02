package com.chaku.ai.model.event;

import java.util.UUID;

public record AddEventMemberRequest(UUID eventId, UUID groupId, UUID memberId, String action) {}
