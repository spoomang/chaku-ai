package com.chaku.ai.model.venue;

public record CreateVenueRequest(
        String name,
        String address,
        Double latitude,
        Double longitude,
        String openingTime,
        String closingTime,
        Integer rating
) {}
