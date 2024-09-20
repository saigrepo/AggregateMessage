package com.aggregatemessenger.api.service.impl;

import com.aggregatemessenger.api.dtos.messageDtos.request.GroupConversationRequestDTO;
import com.aggregatemessenger.api.exceptions.ConversationException;
import com.aggregatemessenger.api.exceptions.UserException;
import com.aggregatemessenger.api.model.Conversation;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.repository.ConversationRepository;
import com.aggregatemessenger.api.service.ConversationService;
import com.aggregatemessenger.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final UserService userService;
    private final ConversationRepository conversationRepository;

    @Override
    public Conversation createConversation(User reqUser, UUID userId2) throws UserException {

        User user2 = userService.findUserById(userId2);

        Optional<Conversation> existingConversationOptional = conversationRepository.findSingleConversationByUsers(user2, reqUser);

        if (existingConversationOptional.isPresent()) {
            return existingConversationOptional.get();
        }

        Conversation conversation = Conversation.builder()
                .createdBy(reqUser)
                .users(new HashSet<>(Set.of(reqUser, user2)))
                .isGroup(false)
                .build();

        return conversationRepository.save(conversation);
    }

    @Override
    public Conversation findConversationById(UUID id) throws ConversationException {

        Optional<Conversation> conversationOptional = conversationRepository.findById(id);

        if (conversationOptional.isPresent()) {
            return conversationOptional.get();
        }

        throw new ConversationException("No conversation found with id " + id);
    }

    @Override
    public List<Conversation> findAllByUserId(UUID userId) throws UserException {

        User user = userService.findUserById(userId);

        return conversationRepository.findConversationByUserId(user.getId()).stream()
                .sorted((conversation1, conversation2) -> {
                    if (conversation1.getMessages().isEmpty() && conversation2.getMessages().isEmpty()) {
                        return 0;
                    } else if (conversation1.getMessages().isEmpty()) {
                        return 1;
                    } else if (conversation2.getMessages().isEmpty()) {
                        return -1;
                    }
                    LocalDateTime timeStamp1 = conversation1.getMessages().get(conversation1.getMessages().size() - 1).getTimeStamp();
                    LocalDateTime timeStamp2 = conversation2.getMessages().get(conversation2.getMessages().size() - 1).getTimeStamp();
                    return timeStamp2.compareTo(timeStamp1);
                })
                .toList();
    }

    @Override
    public Conversation createGroup(GroupConversationRequestDTO req, User reqUser) throws UserException {

        Conversation groupConversation = Conversation.builder()
                .isGroup(true)
                .conversationName(req.conversationName())
                .createdBy(reqUser)
                .admins(new HashSet<>(Set.of(reqUser)))
                .users(new HashSet<>())
                .build();

        for (UUID userId : req.userIds()) {
            User userToAdd = userService.findUserById(userId);
            groupConversation.getUsers().add(userToAdd);
        }

        return conversationRepository.save(groupConversation);
    }

    @Override
    public Conversation addUserToGroup(UUID userId, UUID conversationId, User reqUser) throws UserException, ConversationException {

        Conversation conversation = findConversationById(conversationId);
        User user = userService.findUserById(userId);

        if (conversation.getAdmins().contains(reqUser)) {
            conversation.getUsers().add(user);
            return conversationRepository.save(conversation);
        }

        throw new UserException("User doesn't have permissions to add members to group conversation");
    }

    @Override
    public Conversation renameGroup(UUID conversationId, String groupName, User reqUser) throws UserException, ConversationException {

        Conversation conversation = findConversationById(conversationId);

        if (conversation.getAdmins().contains(reqUser)) {
            conversation.setConversationName(groupName);
            return conversationRepository.save(conversation);
        }

        throw new UserException("User doesn't have permissions to rename group conversation");
    }

    @Override
    public Conversation removeFromGroup(UUID conversationId, UUID userId, User reqUser) throws UserException, ConversationException {

        Conversation conversation = findConversationById(conversationId);
        User user = userService.findUserById(userId);

        boolean isAdminOrRemoveSelf = conversation.getAdmins().contains(reqUser) ||
                (conversation.getUsers().contains(reqUser) && user.getId().equals(reqUser.getId()));

        if (isAdminOrRemoveSelf) {
            conversation.getUsers().remove(user);
            return conversationRepository.save(conversation);
        }

        throw new UserException("User doesn't have permissions to remove users from group conversation");
    }

    @Override
    public void deleteConversation(UUID conversationId, UUID userId) throws UserException, ConversationException {

        Conversation conversation = findConversationById(conversationId);
        User user = userService.findUserById(userId);

        boolean isSingleConversationOrAdmin = !conversation.getIsGroup() || conversation.getAdmins().contains(user);

        if (isSingleConversationOrAdmin) {
            conversationRepository.deleteById(conversationId);
            return;
        }

        throw new UserException("User doesn't have permissions to delete group conversation");
    }

    @Override
    public Conversation markAsRead(UUID conversationId, User reqUser) throws ConversationException, UserException {

        Conversation conversation = findConversationById(conversationId);

        if (conversation.getUsers().contains(reqUser)) {
            conversation.getMessages().forEach(msg -> msg.getReadBy().add(reqUser.getId()));

            return conversationRepository.save(conversation);
        }


        throw new UserException("User is not related to conversation");
    }

}
