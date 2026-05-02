package com.chaku.ai.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "event")
@Getter
@Setter
@NoArgsConstructor
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", unique = true)
    private UUID eventId;

    @Column(name = "group_id", nullable = false)
    private UUID groupId;

    @Column(name = "venue_id", nullable = false)
    private UUID venueId;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String params;

    @Column(name = "total_cost")
    private Integer totalCost;

    private String currency;

    @Column(name = "no_of_participants", nullable = false)
    private Integer noOfParticipants;

    @Column(nullable = true)
    private String description;

    @Column(name = "start_date_time")
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "delete_time")
    private LocalDateTime deleteTime;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", referencedColumnName = "id", insertable = false, updatable = false)
    private VenueEntity venue;

    @PrePersist
    void prePersist() {
        if (eventId == null) eventId = UUID.randomUUID();
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        updateTime = LocalDateTime.now();
    }
}
