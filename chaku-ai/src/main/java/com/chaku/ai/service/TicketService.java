package com.chaku.ai.service;

import com.chaku.ai.model.ticket.CreateTicketRequest;
import com.chaku.ai.model.ticket.TicketDetailResponse;
import com.chaku.ai.model.ticket.TicketSummaryResponse;

import java.util.List;

public interface TicketService {

    Long createTicket(CreateTicketRequest request);

    List<TicketSummaryResponse> listTickets();

    TicketDetailResponse getTicketById(Long ticketId);
}
