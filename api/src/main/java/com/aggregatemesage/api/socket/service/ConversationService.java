package com.aggregatemesage.api.socket.service;

import com.aggregatemesage.api.repository.UserRepository;
import com.aggregatemesage.api.socket.model.Conversation;
import com.aggregatemesage.api.socket.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public Optional<Conversation> getConversation(UUID conversationId) {
        return conversationRepository.findById(conversationId);
    }

    @Transactional(readOnly = true)
    public List<Conversation> getConversationsForUser(String userId) {
        List<Conversation> allConversations = conversationRepository.findAll();
        return allConversations.stream()
                .filter(conversation -> conversation.getParticipants().contains(userId))
                .collect(Collectors.toList());
    }

    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    public Conversation saveConversation(Conversation conversation) {
        return conversationRepository.save(conversation);
    }

    public void deleteConversationById(UUID convId) {
        conversationRepository.deleteById(convId);
    }
}

