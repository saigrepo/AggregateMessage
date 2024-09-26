package com.aggregatemessenger.api.service;

import com.aggregatemessenger.api.dtos.messageDtos.request.GroupConversationRequestDTO;
import com.aggregatemessenger.api.exceptions.ConversationException;
import com.aggregatemessenger.api.exceptions.UserException;
import com.aggregatemessenger.api.model.Conversation;
import com.aggregatemessenger.api.model.User;

import java.util.List;
import java.util.UUID;

public interface ConversationService {

    Conversation createConversation(User reqUser, UUID userId2) throws Exception;

    Conversation findConversationById(UUID id) throws ConversationException;

    List<Conversation> findAllByUserId(UUID userId) throws Exception;

    Conversation createGroup(GroupConversationRequestDTO req, User reqUser) throws UserException;

    Conversation addUserToGroup(UUID userId, UUID conversationId, User reqUser) throws UserException, ConversationException;

    Conversation renameGroup(UUID conversationId, String groupName, User reqUser) throws UserException, ConversationException;

    Conversation removeFromGroup(UUID conversationId, UUID userId, User reqUser) throws UserException, ConversationException;

    void deleteConversation(UUID conversationId, UUID userId) throws UserException, ConversationException;

    Conversation markAsRead(UUID conversationId, User reqUser) throws ConversationException, UserException;

}
