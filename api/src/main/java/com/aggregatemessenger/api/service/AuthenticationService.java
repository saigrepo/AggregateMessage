package com.aggregatemessenger.api.service;

import com.aggregatemessenger.api.dtos.authDtos.LoginUserDto;
import com.aggregatemessenger.api.dtos.authDtos.RegisterUserDto;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User signup(RegisterUserDto user) {
        User newUser = new User();
        newUser.setEmailId(user.getEmailId());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setProfileCreated(false);
        newUser.setViaGoogle(false);
        return userRepository.save(newUser);
    }

    public User authenticate(LoginUserDto user) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmailId(), user.getPassword()));

        return userRepository.findByEmailId(user.getEmailId()).orElseThrow();
    }

    public User gAuth(String emailId) {
        Optional<User> usr = userRepository.findByEmailId(emailId);
        if(usr.isEmpty()) {
            User newUser = new User();
            newUser.setEmailId(emailId);
            newUser.setProfileCreated(false);
            newUser.setPassword(passwordEncoder.encode(emailId));
            newUser.setViaGoogle(true);
            userRepository.save(newUser);
            return newUser;
        }
        return usr.get();
    }

}
