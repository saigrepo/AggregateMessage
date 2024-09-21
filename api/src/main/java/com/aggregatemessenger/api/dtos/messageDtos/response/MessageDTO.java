package com.aggregatemessenger.api.dtos.messageDtos.response;

import com.aggregatemessenger.api.model.Message;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.*;

@Builder
public record MessageDTO(UUID id, String content, LocalDateTime timeStamp, UserDTO user, Set<UUID> readBy) {

    public static MessageDTO fromMessage(Message message) {
        if (Objects.isNull(message)) return null;
        return MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .timeStamp(message.getTimeStamp())
                .user(UserDTO.fromUser(message.getUser()))
                .readBy(new HashSet<>(message.getReadBy()))
                .build();
    }

    public static List<MessageDTO> fromMessages(Collection<Message> messages) {
        if (Objects.isNull(messages) || messages.isEmpty()) return List.of();
        return messages.stream()
                .map(MessageDTO::fromMessage)
                .toList();
    }

}
