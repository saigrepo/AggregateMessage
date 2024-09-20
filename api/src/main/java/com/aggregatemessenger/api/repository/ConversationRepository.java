package com.aggregatemessenger.api.repository;

import com.aggregatemessenger.api.model.Conversation;
import com.aggregatemessenger.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query("select c from Conversation c join c.users u where u.id = :userId")
    List<Conversation> findConversationByUserId(@Param("userId") UUID userId);

    @Query("SELECT c FROM Conversation c WHERE c.isGroup = false AND :user2 MEMBER OF c.users AND :reqUser MEMBER OF c.users")
    Optional<Conversation> findSingleConversationByUsers(@Param("user2") User user2, @Param("reqUser") User reqUser);

}
