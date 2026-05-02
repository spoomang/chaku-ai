package com.chaku.ai.model.group;

import java.util.List;
import java.util.UUID;

public record AddMembersRequest(UUID groupId, List<GroupMemberInput> members) {}
