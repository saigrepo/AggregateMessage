package com.aggregatemessenger.api.dtos.authDtos;

import lombok.*;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserResponse {

    private UUID userId;
    private String userEmail;
    private Boolean userProfileCreated;
    private String userColor;
    private String firstName;
    private String lastName;
    private boolean viaGoogle;
}
