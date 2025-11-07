package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.UpdateProfileRequestDto;
import com.groceryapp.backend.exception.UserAlreadyExistsException;
import com.groceryapp.backend.exception.UserNotFoundException;
import com.groceryapp.backend.model.User;
import com.groceryapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public User getUserById(UUID userId) {
        log.info("Fetching user with ID: {}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }
    
    @Transactional
    public User updateProfile(UUID userId, UpdateProfileRequestDto requestDto) {
        log.info("Updating profile for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        
        // Check if email is being changed and if new email already exists
        if (requestDto.getEmail() != null && !requestDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(requestDto.getEmail())) {
                throw new UserAlreadyExistsException(requestDto.getEmail());
            }
            user.setEmail(requestDto.getEmail());
        }
        
        if (requestDto.getName() != null) {
            user.setName(requestDto.getName());
        }
        
        if (requestDto.getPhoneNumber() != null) {
            user.setPhoneNumber(requestDto.getPhoneNumber());
        }
        
        User updatedUser = userRepository.save(user);
        log.info("Profile updated successfully for user: {}", userId);
        
        return updatedUser;
    }
}
