package com.aggregatemessenger.api.repository;

import com.aggregatemessenger.api.dtos.authDtos.UserResponse;
import com.aggregatemessenger.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmailId(String emailId);

    List<User> findByFirstName(String firstName);

    Page<User> findByFirstNameContainingIgnoreCase(String firstname, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:query% OR u.emailId LIKE %:query%")
    List<User> findByFirstNameOrEmail(@Param("query") String query);
}
