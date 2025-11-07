package com.groceryapp.backend.controller;

import com.groceryapp.backend.dto.UpdateProfileRequestDto;
import com.groceryapp.backend.model.User;
import com.groceryapp.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable UUID id) {
        log.info("Received request to get user profile with ID: {}", id);
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserProfile(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProfileRequestDto requestDto) {
        log.info("Received request to update user profile with ID: {}", id);
        User user = userService.updateProfile(id, requestDto);
        return ResponseEntity.ok(user);
    }
}
