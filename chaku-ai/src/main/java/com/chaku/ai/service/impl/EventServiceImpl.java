package com.chaku.ai.service.impl;

import com.chaku.ai.service.EventMemberService;
import com.chaku.ai.service.EventService;

import com.chaku.ai.entity.EventEntity;
import com.chaku.ai.model.event.CreateEventRequest;
import com.chaku.ai.model.event.EventDetailResponse;
import com.chaku.ai.model.event.SearchEventRequest;
import com.chaku.ai.repository.EventRepository;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventMemberService eventMemberService;
    private final ObjectMapper objectMapper;

    public EventServiceImpl(EventRepository eventRepository, EventMemberService eventMemberService, ObjectMapper objectMapper) {
        this.eventRepository = eventRepository;
        this.eventMemberService = eventMemberService;
        this.objectMapper = objectMapper;
    }

    @Override
    public UUID createEvent(CreateEventRequest request) {
        EventEntity event = new EventEntity();
        event.setGroupId(request.groupId());
        event.setVenueId(parseUuid(request.venueId()));
        event.setCreatedBy(request.creatorId());
        event.setName(request.name());
        event.setType(request.type());
        event.setStatus("CREATED");
        try {
            event.setParams(request.params() != null ? objectMapper.writeValueAsString(request.params()) : null);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid params format", e);
        }
        event.setTotalCost(request.totalCost());
        event.setCurrency(request.currency());
        event.setNoOfParticipants(request.noOfParticipants());
        event.setDescription(request.description());
        event.setStartDateTime(request.startDateTime());
        event.setEndDateTime(request.endDateTime());
        return eventRepository.save(event).getEventId();
    }

    @Override
    public List<EventDetailResponse> getEventsByGroupId(String groupId, boolean getCountOfParticipants) {
        List<EventDetailResponse> events = eventRepository.findEventDetailsByGroupId(UUID.fromString(groupId));
        return enrichWithCountAndCost(events, getCountOfParticipants);
    }

    @Override
    public List<EventDetailResponse> searchEvents(SearchEventRequest request) {
        List<EventDetailResponse> events = eventRepository.searchEventDetails(
                request.groupId(), request.venueId(), request.status(), request.type(), request.venueName());
        return enrichWithCountAndCost(events, request.getCountOfParticipants());
    }

    private List<EventDetailResponse> enrichWithCountAndCost(List<EventDetailResponse> events, boolean getCount) {
        if (!getCount || events.isEmpty()) return events;

        List<UUID> eventIds = events.stream().map(EventDetailResponse::getEventId).toList();
        Map<UUID, Long> countMap = eventMemberService.countMembersByEventIds(eventIds);

        events.forEach(e -> {
            if (e.getNoOfParticipants() != null && e.getNoOfParticipants() > 0 && e.getTotalCost() != null) {
                e.setCostPerPerson((float) e.getTotalCost() / e.getNoOfParticipants());
            }
            e.setNoOfJoinedParticipants(countMap.getOrDefault(e.getEventId(), 0L));
        });
        return events;
    }

    private static final UUID NULL_UUID = new UUID(0, 0);

    private UUID parseUuid(String value) {
        if (value == null || value.isEmpty()) return NULL_UUID;
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException e) {
            return NULL_UUID;
        }
    }
}
