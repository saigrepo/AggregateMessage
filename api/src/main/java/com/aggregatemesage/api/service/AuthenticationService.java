package com.aggregatemesage.api.service;

import com.aggregatemesage.api.LoginUserDto;
import com.aggregatemesage.api.dtos.RegisterUserDto;
import com.aggregatemesage.api.model.User;
import com.aggregatemesage.api.repository.UserRepository;
import org.apache.coyote.Response;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        return userRepository.save(newUser);
    }

    public User authenticate(LoginUserDto user) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmailId(), user.getPassword()));

        return userRepository.findByEmailId(user.getEmailId()).orElseThrow();
    }
}
