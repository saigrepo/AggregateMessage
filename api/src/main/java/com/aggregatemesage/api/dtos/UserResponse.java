package com.aggregatemesage.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserResponse {

    private Integer userId;
    private String userEmail;
    private Boolean userProfileCreated;
    private String userColor;
    private String firstName;
    private String lastName;
}
