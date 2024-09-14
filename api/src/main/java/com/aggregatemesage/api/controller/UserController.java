package com.aggregatemesage.api.controller;

import com.aggregatemesage.api.dtos.UpdateUserDTO;
import com.aggregatemesage.api.dtos.UserResponse;
import com.aggregatemesage.api.model.User;
import com.aggregatemesage.api.service.JwtService;
import com.aggregatemesage.api.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class UserController {

    private final UserService userService;

    private final JwtService jwtService;

    @Autowired
    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/self")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(currentUser);
    }

    @GetMapping
    public ResponseEntity<List<User>> allUsers() {
        List <User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/user")
    public ResponseEntity<UserResponse> getCurrentUser() throws Exception {
        User user = this.userService.getUserByEmail(this.userService.getCurrentUserInfo().toString());
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmailId(), user.getProfileCreated(), user.getProfileColor(), user.getFirstname(), user.getLastname()));
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity updateUserById(@PathVariable Integer userId, @RequestBody UpdateUserDTO updateUserDTO) {
        User user = this.userService.updateUserById(userId, updateUserDTO);
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmailId(), user.getProfileCreated(), user.getProfileColor(), user.getFirstname(), user.getLastname()));
    }
}
