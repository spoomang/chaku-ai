package com.chaku.ai.service.impl;

import com.chaku.ai.entity.TicketEntity;
import com.chaku.ai.model.ticket.CreateTicketRequest;
import com.chaku.ai.model.ticket.TicketDetailResponse;
import com.chaku.ai.model.ticket.TicketSummaryResponse;
import com.chaku.ai.repository.TicketRepository;
import com.chaku.ai.service.TicketService;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final ObjectMapper objectMapper;

    public TicketServiceImpl(TicketRepository ticketRepository, ObjectMapper objectMapper) {
        this.ticketRepository = ticketRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public Long createTicket(CreateTicketRequest request) {
        TicketEntity ticket = new TicketEntity();
        ticket.setFormId(request.formId());
        ticket.setSubmittedBy(request.submittedBy());
        try {
            ticket.setData(request.data() != null ? objectMapper.writeValueAsString(request.data()) : "{}");
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid ticket data format", e);
        }
        ticket.setStatus("open");
        return ticketRepository.save(ticket).getId();
    }

    @Override
    public List<TicketSummaryResponse> listTickets() {
        return ticketRepository.findAll().stream()
                .map(t -> new TicketSummaryResponse(t.getId(), t.getFormId(), t.getSubmittedBy(), t.getStatus(), t.getCreatedAt()))
                .toList();
    }

    @Override
    public TicketDetailResponse getTicketById(Long ticketId) {
        TicketEntity ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found: " + ticketId));
        Map<String, Object> data;
        try {
            data = objectMapper.readValue(ticket.getData(), new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            data = Map.of();
        }
        return new TicketDetailResponse(
                ticket.getId(),
                ticket.getFormId(),
                ticket.getSubmittedBy(),
                ticket.getStatus(),
                data,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt());
    }
}
