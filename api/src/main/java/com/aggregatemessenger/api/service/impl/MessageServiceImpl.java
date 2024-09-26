package com.aggregatemessenger.api.service.impl;

import com.aggregatemessenger.api.dtos.messageDtos.request.SendMessageRequestDTO;
import com.aggregatemessenger.api.exceptions.ConversationException;
import com.aggregatemessenger.api.exceptions.MessageException;
import com.aggregatemessenger.api.exceptions.UserException;
import com.aggregatemessenger.api.model.Conversation;
import com.aggregatemessenger.api.model.Message;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.repository.ConversationRepository;
import com.aggregatemessenger.api.repository.MessageRepository;
import com.aggregatemessenger.api.service.ConversationService;
import com.aggregatemessenger.api.service.MessageService;
import com.aggregatemessenger.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final UserService userService;
    private final ConversationService conversationService;
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    @Override
    @Transactional
    public Message sendMessage(SendMessageRequestDTO req, UUID userId) throws UserException, ConversationException {

        User user = userService.findUserById(userId);
        Conversation conversation = conversationService.findConversationById(req.conversationId());

        Message message = Message.builder()
                .conversation(conversation)
                .user(user)
                .content(req.content())
                .timeStamp(LocalDateTime.now())
                .readBy(new HashSet<>(Set.of(user.getId())))
                .build();

        conversation.getMessages().add(message);
        return messageRepository.save(message);
    }

    @Override
    @Transactional
    public List<Message> getConversationMessages(UUID conversationId, User reqUser) throws UserException, ConversationException {

        Conversation conversation = conversationService.findConversationById(conversationId);

        if (!conversation.getUsers().contains(reqUser)) {
            throw new UserException("User isn't related to conversation " + conversationId);
        }

        return messageRepository.findByConversation_Id(conversation.getId());
    }

    @Override
    @Transactional
    public Message findMessageById(UUID messageId) throws MessageException {

        Optional<Message> message = messageRepository.findById(messageId);

        if (message.isPresent()) {
            return message.get();
        }

        throw new MessageException("Message not found " + messageId);
    }

    @Override
    @Transactional
    public void deleteMessageById(UUID messageId, User reqUser) throws UserException, MessageException {

        Message message = findMessageById(messageId);

        if (message.getUser().getId().equals(reqUser.getId())) {
            messageRepository.deleteById(messageId);
            return;
        }

        throw new UserException("User is not related to message " + message.getId());
    }

}
