package com.aggregatemessenger.api.dtos.messageDtos.response;

import com.aggregatemessenger.api.model.User;
import lombok.Builder;

import java.util.*;
import java.util.stream.Collectors;

@Builder
public record UserDTO(UUID userId,
         String userEmail,
         Boolean userProfileCreated,
         String userColor,
         String firstName,
         String lastName) {

    public static UserDTO fromUser(User user) {
        if (Objects.isNull(user)) return null;
        return UserDTO.builder()
                .userId(user.getId())
                .userEmail(user.getEmailId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userProfileCreated(user.getProfileCreated())
                .userColor(user.getProfileColor())
                .build();
    }

    public static Set<UserDTO> fromUsers(Collection<User> users) {
        if (Objects.isNull(users)) return Set.of();
        return users.stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toSet());
    }

    public static List<UserDTO> fromUsersAsList(Collection<User> users) {
        if (Objects.isNull(users)) return List.of();
        return users.stream()
                .map(UserDTO::fromUser)
                .toList();
    }

}
