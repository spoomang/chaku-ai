package com.chaku.ai.service;

import com.chaku.ai.entity.EventMemberEntity;
import com.chaku.ai.model.event.AddEventMemberRequest;
import com.chaku.ai.model.event.EventMemberDetailResponse;
import com.chaku.ai.repository.EventMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventMemberServiceImpl implements EventMemberService {

    private final EventMemberRepository eventMemberRepository;

    public EventMemberServiceImpl(EventMemberRepository eventMemberRepository) {
        this.eventMemberRepository = eventMemberRepository;
    }

    @Override
    public void addEventMember(AddEventMemberRequest request) {
        EventMemberEntity em = new EventMemberEntity();
        em.setEventId(request.eventId());
        em.setGroupId(request.groupId());
        em.setMemberId(request.memberId());
        em.setAction(request.action());
        em.setStatus("C");
        eventMemberRepository.save(em);
    }

    @Override
    public List<EventMemberDetailResponse> getEventMembers(String eventId) {
        return eventMemberRepository.findMemberDetailsByEventId(UUID.fromString(eventId));
    }

    @Override
    public Map<UUID, Long> countMembersByEventIds(List<UUID> eventIds) {
        return eventMemberRepository.countMembersByEventIds(eventIds).stream()
                .collect(Collectors.toMap(
                        row -> (UUID) row[0],
                        row -> (Long) row[1]
                ));
    }
}
