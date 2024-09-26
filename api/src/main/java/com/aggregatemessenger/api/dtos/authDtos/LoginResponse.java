package com.aggregatemessenger.api.dtos.authDtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private long expiresIn;

    private UUID userId;
    private String userEmail;
    private Boolean userProfileCreated;
    private String userColor;
    private String firstName;
    private String lastName;

    public String getToken() {
        return token;
    }
}
