package com.chaku.ai.controller;

import com.chaku.ai.model.group.AddMembersRequest;
import com.chaku.ai.model.group.CreateGroupRequest;
import com.chaku.ai.model.group.GroupMemberResponse;
import com.chaku.ai.model.group.GroupResponse;
import com.chaku.ai.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping("/group")
    public ResponseEntity<GroupResponse> createGroup(@RequestBody CreateGroupRequest request) {
        return ResponseEntity.ok(groupService.createGroupWithMembers(request));
    }

    @GetMapping("/group")
    public ResponseEntity<GroupResponse> getGroup(@RequestParam String groupId) {
        return ResponseEntity.ok(groupService.getGroupById(groupId));
    }

    @GetMapping("/groups")
    public ResponseEntity<List<GroupResponse>> getGroups(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int perPage) {
        return ResponseEntity.ok(groupService.getGroups(name, page, perPage));
    }

    @PostMapping("/group/members")
    public ResponseEntity<List<GroupMemberResponse>> addMembers(@RequestBody AddMembersRequest request) {
        return ResponseEntity.ok(groupService.addMembersToGroup(request));
    }

    @GetMapping("/group/members")
    public ResponseEntity<List<GroupMemberResponse>> getMembers(@RequestParam String groupId) {
        return ResponseEntity.ok(groupService.getMembersByGroupId(groupId));
    }

    @GetMapping("/member/group")
    public ResponseEntity<List<GroupResponse>> getGroupsByMember(@RequestParam String memberId) {
        return ResponseEntity.ok(groupService.getGroupsByMemberId(memberId));
    }
}
