package com.aggregatemesage.api.repository;

import com.aggregatemesage.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmailId(String emailId);
    Page<User> findByFirstnameContainingIgnoreCase(String firstname, Pageable pageable);

}
