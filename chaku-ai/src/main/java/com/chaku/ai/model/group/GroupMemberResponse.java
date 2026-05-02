package com.chaku.ai.model.group;

import java.util.UUID;

public record GroupMemberResponse(
        UUID memberId,
        String name,
        String shortName,
        String email,
        String mobile,
        String status,
        Boolean isAdmin
) {}
