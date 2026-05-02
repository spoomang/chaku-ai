package com.chaku.ai.service;

import com.chaku.ai.model.message.MessageResponse;
import com.chaku.ai.model.message.SendMessageRequest;

import java.util.List;
import java.util.UUID;

public interface MessageService {
    void createMessage(SendMessageRequest request);
    List<MessageResponse> retrieveMessages(UUID eventId, int offset);
}
