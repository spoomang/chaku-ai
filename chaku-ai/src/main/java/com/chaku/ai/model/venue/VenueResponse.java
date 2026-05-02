package com.chaku.ai.model.venue;

import java.util.UUID;

public record VenueResponse(
        UUID id,
        String name,
        String address,
        Double latitude,
        Double longitude,
        String openingTime,
        String closingTime,
        Integer rating
) {}
