package com.aggregatemesage.api.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private long expiresIn;

    public String getToken() {
        return token;
    }
}
