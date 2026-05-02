package com.chaku.ai.service;

import com.chaku.ai.model.event.AddEventMemberRequest;
import com.chaku.ai.model.event.EventMemberDetailResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface EventMemberService {
    void addEventMember(AddEventMemberRequest request);
    List<EventMemberDetailResponse> getEventMembers(String eventId);
    Map<UUID, Long> countMembersByEventIds(List<UUID> eventIds);
}
