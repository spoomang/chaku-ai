package com.chaku.ai.service.impl;

import com.chaku.ai.service.MessageService;

import com.chaku.ai.entity.MessageEntity;
import com.chaku.ai.model.message.MessageResponse;
import com.chaku.ai.model.message.SendMessageRequest;
import com.chaku.ai.repository.MessageRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MessageServiceImpl implements MessageService {

    private static final int PAGE_SIZE = 20;

    private final MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public void createMessage(SendMessageRequest request) {
        MessageEntity message = new MessageEntity();
        message.setMemberId(request.memberId());
        message.setGroupId(request.groupId());
        message.setEventId(request.eventId());
        message.setName(request.name());
        message.setContent(request.content());
        messageRepository.save(message);
    }

    @Override
    public List<MessageResponse> retrieveMessages(UUID eventId, int offset) {
        int page = offset / PAGE_SIZE;
        return messageRepository.findByEventId(eventId, PageRequest.of(page, PAGE_SIZE))
                .map(m -> new MessageResponse(m.getEventId(), m.getGroupId(), m.getMemberId(),
                        m.getName(), m.getContent(), m.getCreateTime(), m.getUpdateTime()))
                .toList();
    }
}
