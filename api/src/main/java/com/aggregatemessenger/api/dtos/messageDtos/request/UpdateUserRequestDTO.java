package com.aggregatemessenger.api.dtos.messageDtos.request;

public record UpdateUserRequestDTO(String email, String password, String fullName) {
}
