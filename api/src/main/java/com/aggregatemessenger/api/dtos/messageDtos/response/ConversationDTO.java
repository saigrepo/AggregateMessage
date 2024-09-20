package com.aggregatemessenger.api.dtos.messageDtos.response;

import com.aggregatemessenger.api.model.Conversation;
import lombok.Builder;

import java.util.*;

@Builder
public record ConversationDTO(
        UUID id,
        String conversationName,
        Boolean isGroup,
        Set<UserDTO> admins,
        Set<UserDTO> users,
        UserDTO createdBy,
        List<MessageDTO> messages) {

    public static ConversationDTO fromConversation(Conversation conversation) {
        if (Objects.isNull(conversation)) return null;
        return ConversationDTO.builder()
                .id(conversation.getId())
                .conversationName(conversation.getConversationName())
                .isGroup(conversation.getIsGroup())
                .admins(UserDTO.fromUsers(conversation.getAdmins()))
                .users(UserDTO.fromUsers(conversation.getUsers()))
                .createdBy(UserDTO.fromUser(conversation.getCreatedBy()))
                .messages(MessageDTO.fromMessages(conversation.getMessages()))
                .build();
    }

    public static List<ConversationDTO> fromConversations(Collection<Conversation> conversations) {
        if (Objects.isNull(conversations)) return List.of();
        return conversations.stream()
                .map(ConversationDTO::fromConversation)
                .toList();
    }

}
