package com.aggregatemesage.api.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDto {

    private String emailId;
    private String password;
}
