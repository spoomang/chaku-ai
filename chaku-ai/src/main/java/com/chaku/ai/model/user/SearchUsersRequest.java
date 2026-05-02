package com.chaku.ai.model.user;

import java.util.UUID;

public record SearchUsersRequest(
        int pageNumber,
        int pageSize,
        UUID groupId,
        boolean excludeUserByGroupId
) {}
