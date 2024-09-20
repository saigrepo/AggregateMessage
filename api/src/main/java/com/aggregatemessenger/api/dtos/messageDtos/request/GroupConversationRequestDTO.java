package com.aggregatemessenger.api.dtos.messageDtos.request;

import java.util.List;
import java.util.UUID;

public record GroupConversationRequestDTO(List<UUID> userIds, String conversationName) {
}
