package com.webkorps.platform.identity.service;


import com.webkorps.platform.common.exception.ResourceNotFoundException;
import com.webkorps.platform.dto.UserResponse;
import com.webkorps.platform.identity.entity.User;
import com.webkorps.platform.identity.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional()
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + id)
                );
    }
    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found with email: " + email)
                );
    }

    public boolean isEmailRegistered(String email) {

        return userRepository.existsByEmail(email);
    }


    public UserResponse getUserResponseById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with ID: " + id));

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus()
        );
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getAccountStatus()
                ))
                .toList();
    }

}
