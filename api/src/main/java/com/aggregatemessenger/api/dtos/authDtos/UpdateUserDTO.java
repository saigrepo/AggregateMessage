package com.aggregatemessenger.api.dtos.authDtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateUserDTO {
    private String firstName;
    private String lastName;
    private String userColor;
    private Boolean userProfileCreated;

}
