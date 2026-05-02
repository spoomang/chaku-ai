package com.chaku.ai.model.group;

import java.util.UUID;

public record GroupResponse(UUID groupId, String name, String description, Integer size) {}
