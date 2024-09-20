package com.aggregatemessenger.api.controller;

import com.aggregatemessenger.api.dtos.authDtos.LoginResponse;
import com.aggregatemessenger.api.dtos.authDtos.LoginUserDto;
import com.aggregatemessenger.api.dtos.authDtos.RegisterUserDto;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.service.AuthenticationService;
import com.aggregatemessenger.api.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/auth")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(),authenticatedUser.getId(), authenticatedUser.getEmailId(), authenticatedUser.getProfileCreated(), authenticatedUser.getProfileColor(), authenticatedUser.getFirstName(), authenticatedUser.getLastName());

        return ResponseEntity.ok(loginResponse);
    }
}
