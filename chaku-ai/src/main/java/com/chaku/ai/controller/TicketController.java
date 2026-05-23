package com.chaku.ai.controller;

import com.chaku.ai.model.ApiResponse;
import com.chaku.ai.model.ticket.CreateTicketRequest;
import com.chaku.ai.model.ticket.TicketDetailResponse;
import com.chaku.ai.model.ticket.TicketSummaryResponse;
import com.chaku.ai.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/tickets")
    public ResponseEntity<ApiResponse<Map<String, Long>>> createTicket(@RequestBody CreateTicketRequest request) {
        Long ticketId = ticketService.createTicket(request);
        return ResponseEntity.ok(new ApiResponse<>(Map.of("ticketId", ticketId)));
    }

    @GetMapping("/tickets")
    public ResponseEntity<ApiResponse<List<TicketSummaryResponse>>> listTickets() {
        return ResponseEntity.ok(new ApiResponse<>(ticketService.listTickets()));
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<ApiResponse<TicketDetailResponse>> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(ticketService.getTicketById(id)));
    }
}
