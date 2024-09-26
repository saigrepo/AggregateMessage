package com.aggregatemessenger.api.service;

import com.aggregatemessenger.api.dtos.authDtos.UpdateUserDTO;
import com.aggregatemessenger.api.dtos.authDtos.UserResponse;
import com.aggregatemessenger.api.exceptions.UserException;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

public interface UserService {

    String getCurrentUserInfo();
    List<User> allUsers();
    User getUserByEmail(String email) throws UserException;
    User updateUserById(UUID id, UpdateUserDTO updateUserDTO);
    List<User> searchUser(String query);
    List<User> searchUserByName(String name);
    public User findUserById(UUID userId) throws UserException;

    Page<UserResponse> searchContacts(String query, Pageable pageable);
}
