package com.aggregatemesage.api.controller;

import com.aggregatemesage.api.model.User;
import com.aggregatemesage.api.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contacts")
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class ContactController {
    private final UserService userService;
    @Autowired
    public ContactController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/search")
    public Page<User> searchContacts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<User> pge= userService.searchContacts(query, PageRequest.of(page, size));
        return pge;
    }
}
