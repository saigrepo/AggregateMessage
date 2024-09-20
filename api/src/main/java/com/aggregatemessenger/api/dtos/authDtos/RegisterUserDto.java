package com.aggregatemessenger.api.dtos.authDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDto {

    private String emailId;
    private String password;
}
