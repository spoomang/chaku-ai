package com.chaku.ai.model.group;

import java.util.UUID;

public record GroupMemberInput(UUID memberId, Boolean isAdmin) {}
