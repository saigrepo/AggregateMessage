package com.aggregatemessenger.api.dtos.messageDtos.request;

import java.util.UUID;

public record SendMessageRequestDTO(UUID conversationId, String content) {
}
