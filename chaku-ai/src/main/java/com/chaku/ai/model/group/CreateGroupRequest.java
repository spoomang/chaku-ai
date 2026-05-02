package com.chaku.ai.model.group;

import java.util.List;

public record CreateGroupRequest(GroupInfo groupInfo, List<GroupMemberInput> members) {
    public record GroupInfo(String name, String description, Integer size) {}
}
