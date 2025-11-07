package com.groceryapp.backend.service;

import com.groceryapp.backend.config.JwtUtil;
import com.groceryapp.backend.dto.AuthResponseDto;
import com.groceryapp.backend.dto.LoginRequestDto;
import com.groceryapp.backend.dto.RegisterRequestDto;
import com.groceryapp.backend.exception.InvalidCredentialsException;
import com.groceryapp.backend.exception.UserAlreadyExistsException;
import com.groceryapp.backend.model.User;
import com.groceryapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthResponseDto register(RegisterRequestDto requestDto) {
        log.info("Registering new user with email: {}", requestDto.getEmail());
        
        // Check if user already exists
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            log.warn("Registration failed: User with email {} already exists", requestDto.getEmail());
            throw new UserAlreadyExistsException(requestDto.getEmail());
        }
        
        // Create new user
        User user = new User();
        user.setName(requestDto.getName());
        user.setEmail(requestDto.getEmail());
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        user.setPhoneNumber(requestDto.getPhoneNumber());
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        
        // Generate JWT token
        String token = jwtUtil.generateToken(
                savedUser.getId(), 
                savedUser.getEmail(), 
                savedUser.getName()
        );
        
        return new AuthResponseDto(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhoneNumber(),
                savedUser.getCreatedAt(),
                "Registration successful"
        );
    }
    
    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto requestDto) {
        log.info("Login attempt for email: {}", requestDto.getEmail());
        
        // Find user by email
        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found with email {}", requestDto.getEmail());
                    return new InvalidCredentialsException();
                });
        
        // Verify password
        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
            log.warn("Login failed: Invalid password for email {}", requestDto.getEmail());
            throw new InvalidCredentialsException();
        }
        
        log.info("User logged in successfully with ID: {}", user.getId());
        
        // Generate JWT token
        String token = jwtUtil.generateToken(
                user.getId(), 
                user.getEmail(), 
                user.getName()
        );
        
        return new AuthResponseDto(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getCreatedAt(),
                "Login successful"
        );
    }
}
