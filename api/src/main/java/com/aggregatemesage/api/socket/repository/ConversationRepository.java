package com.aggregatemesage.api.socket.repository;

import com.aggregatemesage.api.socket.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
}
