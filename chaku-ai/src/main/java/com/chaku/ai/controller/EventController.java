package com.chaku.ai.controller;

import com.chaku.ai.model.ApiResponse;
import com.chaku.ai.model.event.*;
import com.chaku.ai.service.EventMemberService;
import com.chaku.ai.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class EventController {

    private final EventService eventService;
    private final EventMemberService eventMemberService;

    public EventController(EventService eventService, EventMemberService eventMemberService) {
        this.eventService = eventService;
        this.eventMemberService = eventMemberService;
    }

    @PostMapping("/events")
    public ResponseEntity<ApiResponse<Map<String, UUID>>> createEvent(@RequestBody CreateEventRequest request) {
        UUID eventId = eventService.createEvent(request);
        return ResponseEntity.ok(new ApiResponse<>(Map.of("eventId", eventId)));
    }

    @GetMapping("/group/events")
    public ResponseEntity<ApiResponse<List<EventDetailResponse>>> getEventsByGroup(
            @RequestParam String groupId,
            @RequestParam(defaultValue = "false") boolean getCountOfParticipants) {
        return ResponseEntity.ok(new ApiResponse<>(eventService.getEventsByGroupId(groupId, getCountOfParticipants)));
    }

    @PostMapping("/events/search")
    public ResponseEntity<ApiResponse<List<EventDetailResponse>>> searchEvents(@RequestBody SearchEventRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(eventService.searchEvents(request)));
    }

    @PostMapping("/events/members")
    public ResponseEntity<ApiResponse<Map<String, String>>> addEventMember(@RequestBody AddEventMemberRequest request) {
        eventMemberService.addEventMember(request);
        return ResponseEntity.ok(new ApiResponse<>(Map.of("status", "CONFIRMED")));
    }

    @GetMapping("/events/members")
    public ResponseEntity<ApiResponse<List<EventMemberDetailResponse>>> getEventMembers(@RequestParam String eventId) {
        return ResponseEntity.ok(new ApiResponse<>(eventMemberService.getEventMembers(eventId)));
    }
}
