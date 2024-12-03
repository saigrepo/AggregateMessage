package com.aggregatemessenger.api.service.impl;

import com.aggregatemessenger.api.dtos.authDtos.UpdateUserDTO;
import com.aggregatemessenger.api.dtos.authDtos.UserResponse;
import com.aggregatemessenger.api.exceptions.UserException;
import com.aggregatemessenger.api.model.User;
import com.aggregatemessenger.api.repository.UserRepository;
import com.aggregatemessenger.api.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public List<User> allUsers() {
        List<User> users = this.userRepository.findAll();
        return users;
    }

    @Override
    @Transactional
    public User findUserById(UUID userId) throws UserException {
        return this.userRepository.findById(userId).orElseThrow(() -> new UserException("User not found: " + userId));
    }

    public User getUserByEmail(String email) throws UserException {
        return this.userRepository.findByEmailId(email).orElseThrow(() -> new UserException("User not found: " + email));
    }

    @Override
    public String getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                return userDetails.getUsername();
            }
        }
        return null;
    }

    @Override
    @Transactional
    public User updateUserById(UUID id, UpdateUserDTO dto) {
        return userRepository.findById(id)
                .map(user -> {
                    Optional.ofNullable(dto.getUserColor()).ifPresent(user::setProfileColor);
                    Optional.ofNullable(dto.getFirstName()).ifPresent(user::setFirstName);
                    Optional.ofNullable(dto.getLastName()).ifPresent(user::setLastName);
                    Optional.ofNullable(dto.getUserProfileCreated()).ifPresent(user::setProfileCreated);
                    Optional.ofNullable(dto.getPassword()).ifPresent(p -> user.setPassword(passwordEncoder.encode(p)));
                    Optional.ofNullable(dto.getEmail()).ifPresent(user::setEmailId);
                    return userRepository.save(user);
                })
                .orElse(null);
    }

    @Override
    public List<User> searchUser(String query) {
        return userRepository.findByFirstNameOrEmail(query).stream()
                .sorted(Comparator.comparing(User::getFullName))
                .toList();
    }

    @Override
    @Transactional
    public List<User> searchUserByName(String name) {
        return userRepository.findByFirstName(name).stream()
                .sorted(Comparator.comparing(User::getFirstName))
                .toList();
    }

    @Override
    @Transactional
    public Page<UserResponse> searchContacts(String query, Pageable pageable) {
        return userRepository.findByFirstNameContainingIgnoreCase(query, pageable).map(
                user -> {
                    return new UserResponse(user.getId(), user.getEmailId(), user.getProfileCreated(), user.getProfileColor(), user.getFirstName(), user.getLastName(), user.getViaGoogle());
                }
        );
    }

}
