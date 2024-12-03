package com.aggregatemessenger.api.controller;

import com.aggregatemessenger.api.dtos.GAuthDto;
import com.aggregatemessenger.api.dtos.authDtos.LoginResponse;
import com.aggregatemessenger.api.dtos.authDtos.LoginUserDto;
import com.aggregatemessenger.api.dtos.authDtos.RegisterUserDto;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.service.AuthenticationService;
import com.aggregatemessenger.api.service.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@RequestMapping("/api/v1/auth")
@RestController
@CrossOrigin(origins = "${frontend.url}")
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

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

        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(),authenticatedUser.getId(), authenticatedUser.getEmailId(), authenticatedUser.getProfileCreated(), authenticatedUser.getProfileColor(), authenticatedUser.getFirstName(), authenticatedUser.getLastName(), authenticatedUser.getViaGoogle());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/oauth2/google")
    public ResponseEntity<?> googleAuthCallback(@RequestBody GAuthDto credential) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
        GoogleIdToken idToken = verifier.verify(credential.getCredential());
        if (idToken == null) {
            throw new GeneralSecurityException("token is null/not crct");
        }
        System.out.println("verified token");
        GoogleIdToken.Payload payload = idToken.getPayload();
        String emailId = payload.getEmail();
        User authenticatedUser = authenticationService.gAuth(emailId);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(), authenticatedUser.getId(), authenticatedUser.getEmailId(), authenticatedUser.getProfileCreated(), authenticatedUser.getProfileColor(), authenticatedUser.getFirstName(), authenticatedUser.getLastName(), authenticatedUser.getViaGoogle());
        return ResponseEntity.ok(loginResponse);

    }

}
