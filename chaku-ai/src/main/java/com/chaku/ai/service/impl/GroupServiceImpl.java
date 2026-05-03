package com.chaku.ai.service.impl;

import com.chaku.ai.service.GroupService;

import com.chaku.ai.entity.GroupEntity;
import com.chaku.ai.entity.GroupMemberEntity;
import com.chaku.ai.model.group.AddMembersRequest;
import com.chaku.ai.model.group.CreateGroupRequest;
import com.chaku.ai.model.group.GroupMemberResponse;
import com.chaku.ai.model.group.GroupResponse;
import com.chaku.ai.repository.GroupMemberRepository;
import com.chaku.ai.repository.GroupRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    public GroupServiceImpl(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Override
    @Transactional
    public GroupResponse createGroupWithMembers(CreateGroupRequest request) {
        GroupEntity group = new GroupEntity();
        group.setName(request.groupInfo().name());
        group.setDescription(request.groupInfo().description());
        group.setSize(request.groupInfo().size());
        GroupEntity saved = groupRepository.save(group);

        if (request.members() != null && !request.members().isEmpty()) {
            saveMembers(saved.getGroupId(), request.members().stream()
                    .map(m -> {
                        GroupMemberEntity gm = new GroupMemberEntity();
                        gm.setGroupId(saved.getGroupId());
                        gm.setMemberId(m.memberId());
                        gm.setIsAdmin(m.isAdmin());
                        return gm;
                    }).toList());
        }
        return toResponse(saved);
    }

    @Override
    public GroupResponse getGroupById(String groupId) {
        return groupRepository.findByGroupId(UUID.fromString(groupId))
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
    }

    @Override
    public List<GroupResponse> getGroups(String name, int page, int perPage) {
        int safePage = Math.max(page - 1, 0);
        int safePerPage = perPage == 0 ? 10 : perPage;
        if (name != null && !name.isBlank()) {
            return groupRepository.findByNameContainingIgnoreCase(name, PageRequest.of(safePage, safePerPage))
                    .map(this::toResponse).toList();
        }
        return groupRepository.findAll(PageRequest.of(safePage, safePerPage))
                .map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public List<GroupMemberResponse> addMembersToGroup(AddMembersRequest request) {
        List<GroupMemberEntity> members = request.members().stream().map(m -> {
            GroupMemberEntity gm = new GroupMemberEntity();
            gm.setGroupId(request.groupId());
            gm.setMemberId(m.memberId());
            gm.setIsAdmin(m.isAdmin());
            return gm;
        }).toList();
        saveMembers(request.groupId(), members);
        return groupMemberRepository.findMemberDetailsByGroupId(request.groupId());
    }

    @Override
    public List<GroupMemberResponse> getMembersByGroupId(String groupId) {
        return groupMemberRepository.findMemberDetailsByGroupId(UUID.fromString(groupId));
    }

    @Override
    public List<GroupResponse> getGroupsByMemberId(String memberId) {
        return groupRepository.findGroupsByMemberId(UUID.fromString(memberId))
                .stream().map(this::toResponse).toList();
    }

    private void saveMembers(UUID groupId, List<GroupMemberEntity> members) {
        members.forEach(gm -> gm.setGroupId(groupId));
        groupMemberRepository.saveAll(members);
    }

    private GroupResponse toResponse(GroupEntity g) {
        return new GroupResponse(g.getGroupId(), g.getName(), g.getDescription(), g.getSize());
    }
}
