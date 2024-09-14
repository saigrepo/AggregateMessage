package com.aggregatemesage.api.service;

import com.aggregatemesage.api.dtos.UpdateUserDTO;
import com.aggregatemesage.api.model.User;
import com.aggregatemesage.api.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

    public User getUserById(Integer userId) throws Exception {
        return this.userRepository.findById(userId).orElseThrow(() -> new Exception("User not found: " + userId));
    }

    public User getUserByEmail(String email) throws Exception {
        return this.userRepository.findByEmailId(email).orElseThrow(() -> new Exception("User not found: " + email));
    }

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

    public User updateUserById(Integer id, UpdateUserDTO updateUserDTO) {
        User user = this.userRepository.findById(id).orElse(null);
        if( user!=null) {
            if (updateUserDTO.getUserColor()!=null) {
                user.setProfileColor(updateUserDTO.getUserColor());
            }
            if (updateUserDTO.getFirstName()!=null) {
                user.setFirstname(updateUserDTO.getFirstName());
            }
            if (updateUserDTO.getLastName()!=null) {
                user.setLastname(updateUserDTO.getLastName());
            }
            if (updateUserDTO.getUserProfileCreated()!=null) {
                user.setProfileCreated(updateUserDTO.getUserProfileCreated());
            }
        }
        this.userRepository.save(user);
        return user;
    }


    public Page<User> searchContacts(String query, Pageable pageable) {
        return userRepository.findByFirstnameContainingIgnoreCase(query, pageable);
    }
}
