package com.chaku.ai.controller;

import com.chaku.ai.model.venue.CreateVenueRequest;
import com.chaku.ai.model.venue.SearchVenueRequest;
import com.chaku.ai.model.venue.VenueResponse;
import com.chaku.ai.service.VenueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @PostMapping("/venue")
    public ResponseEntity<VenueResponse> createVenue(@RequestBody CreateVenueRequest request) {
        return ResponseEntity.ok(venueService.createVenue(request));
    }

    @PostMapping("/venues")
    public ResponseEntity<List<VenueResponse>> getVenues(@RequestBody SearchVenueRequest request) {
        return ResponseEntity.ok(venueService.getVenues(request));
    }
}
