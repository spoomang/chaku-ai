package com.chaku.ai.service;

import com.chaku.ai.entity.VenueEntity;
import com.chaku.ai.model.venue.CreateVenueRequest;
import com.chaku.ai.model.venue.SearchVenueRequest;
import com.chaku.ai.model.venue.VenueResponse;
import com.chaku.ai.repository.VenueRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;

    public VenueServiceImpl(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    @Override
    public VenueResponse createVenue(CreateVenueRequest request) {
        VenueEntity venue = new VenueEntity();
        venue.setName(request.name());
        venue.setAddress(request.address());
        venue.setLatitude(request.latitude());
        venue.setLongitude(request.longitude());
        venue.setOpeningTime(request.openingTime());
        venue.setClosingTime(request.closingTime());
        venue.setRating(request.rating());
        return toResponse(venueRepository.save(venue));
    }

    @Override
    public List<VenueResponse> getVenues(SearchVenueRequest request) {
        int page = Math.max(request.pageNumber() - 1, 0);
        int size = request.pageSize() == 0 ? 10 : request.pageSize();
        String name = request.name() != null ? request.name() : "";
        String address = request.address() != null ? request.address() : "";
        return venueRepository.findByNameContainingIgnoreCaseAndAddressContainingIgnoreCase(
                        name, address, PageRequest.of(page, size))
                .map(this::toResponse).toList();
    }

    private VenueResponse toResponse(VenueEntity v) {
        return new VenueResponse(v.getId(), v.getName(), v.getAddress(),
                v.getLatitude(), v.getLongitude(), v.getOpeningTime(), v.getClosingTime(), v.getRating());
    }
}
