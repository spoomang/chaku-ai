package com.chaku.ai.model.venue;

public record SearchVenueRequest(int pageNumber, int pageSize, String name, String address) {}
