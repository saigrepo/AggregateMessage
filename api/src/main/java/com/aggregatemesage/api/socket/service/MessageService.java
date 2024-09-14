package com.aggregatemesage.api.socket.service;

import com.aggregatemesage.api.socket.model.Message;
import com.aggregatemesage.api.socket.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public List<Message> getMessagesByConversation(UUID conversationId) {
        return messageRepository.findByConversationId(conversationId);
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
}
