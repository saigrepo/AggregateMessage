package com.aggregatemessenger.api.service;

import com.aggregatemessenger.api.dtos.messageDtos.request.SendMessageRequestDTO;
import com.aggregatemessenger.api.exceptions.ConversationException;
import com.aggregatemessenger.api.exceptions.MessageException;
import com.aggregatemessenger.api.exceptions.UserException;
import com.aggregatemessenger.api.model.Message;
import com.aggregatemessenger.api.model.User;

import java.util.List;
import java.util.UUID;

public interface MessageService {

    Message sendMessage(SendMessageRequestDTO req, UUID userId) throws UserException, ConversationException;

    List<Message> getConversationMessages(UUID chatId, User reqUser) throws UserException, ConversationException;

    Message findMessageById(UUID messageId) throws MessageException;

    void deleteMessageById(UUID messageId, User reqUser) throws UserException, MessageException;

}
