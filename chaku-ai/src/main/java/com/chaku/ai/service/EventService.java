package com.chaku.ai.service;

import com.chaku.ai.model.event.CreateEventRequest;
import com.chaku.ai.model.event.EventDetailResponse;
import com.chaku.ai.model.event.SearchEventRequest;

import java.util.List;
import java.util.UUID;

public interface EventService {
    UUID createEvent(CreateEventRequest request);
    List<EventDetailResponse> getEventsByGroupId(String groupId, boolean getCountOfParticipants);
    List<EventDetailResponse> searchEvents(SearchEventRequest request);
}
