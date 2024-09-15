package com.aggregatemesage.api.socket.service;

import com.aggregatemesage.api.socket.model.Conversation;
import com.aggregatemesage.api.socket.model.Message;
import com.aggregatemesage.api.socket.repository.ConversationRepository;
import com.aggregatemesage.api.socket.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    public List<Message> getMessagesByConversation(UUID conversationId) {
        return messageRepository.findByConversationId(conversationId);
    }

    public Message saveMessage(Message message) {
        Conversation conv = conversationRepository.findById(message.getConversationId()).orElse(new Conversation());
        List conList = conv.getMessages();
        conList.add(message);
        conv.setMessages(conList);
        conv.setLastMessage(message.getContent());
        conversationRepository.save(conv);
        return messageRepository.save(message);
    }
}
