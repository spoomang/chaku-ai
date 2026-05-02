package com.chaku.ai.model.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDetailResponse {
    private UUID eventId;
    private UUID groupId;
    private UUID venueId;
    private UUID createdBy;
    private String name;
    private String type;
    private String status;
    private String params;
    private Integer totalCost;
    private String currency;
    private Integer noOfParticipants;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String venueName;
    private String venueAddress;
    private Double latitude;
    private Double longitude;
    private Float costPerPerson;
    private Long noOfJoinedParticipants;
}
