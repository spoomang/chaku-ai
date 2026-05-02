package com.chaku.ai.controller;

import com.chaku.ai.model.message.MessageResponse;
import com.chaku.ai.model.message.SendMessageRequest;
import com.chaku.ai.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/groups/events/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody SendMessageRequest request) {
        messageService.createMessage(request);
        return ResponseEntity.ok(Map.of("status", "Ok!"));
    }

    @GetMapping
    public ResponseEntity<List<MessageResponse>> retrieveMessages(
            @RequestParam UUID eventId,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(messageService.retrieveMessages(eventId, offset));
    }
}
