package com.aggregatemesage.api.dtos;

import com.aggregatemesage.api.model.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private long expiresIn;

    private String userEmail;

    private long userId;

    private boolean userProfileCreated;

    public String getToken() {
        return token;
    }
}
