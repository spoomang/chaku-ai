package com.chaku.ai.service;

import com.chaku.ai.model.venue.CreateVenueRequest;
import com.chaku.ai.model.venue.SearchVenueRequest;
import com.chaku.ai.model.venue.VenueResponse;

import java.util.List;

public interface VenueService {
    VenueResponse createVenue(CreateVenueRequest request);
    List<VenueResponse> getVenues(SearchVenueRequest request);
}
