package com.aggregatemesage.api.service;

import com.aggregatemesage.api.model.User;
import com.aggregatemesage.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = this.userRepository.findAll();
        return users;
    }
}
