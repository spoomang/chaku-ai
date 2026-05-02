package com.chaku.ai.service;

import com.chaku.ai.model.group.AddMembersRequest;
import com.chaku.ai.model.group.CreateGroupRequest;
import com.chaku.ai.model.group.GroupMemberResponse;
import com.chaku.ai.model.group.GroupResponse;

import java.util.List;

public interface GroupService {
    GroupResponse createGroupWithMembers(CreateGroupRequest request);
    GroupResponse getGroupById(String groupId);
    List<GroupResponse> getGroups(String name, int page, int perPage);
    List<GroupMemberResponse> addMembersToGroup(AddMembersRequest request);
    List<GroupMemberResponse> getMembersByGroupId(String groupId);
    List<GroupResponse> getGroupsByMemberId(String memberId);
}
