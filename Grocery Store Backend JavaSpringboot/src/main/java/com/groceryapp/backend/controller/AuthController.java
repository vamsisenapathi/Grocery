package com.groceryapp.backend.controller;

import com.groceryapp.backend.dto.AuthResponseDto;
import com.groceryapp.backend.dto.LoginRequestDto;
import com.groceryapp.backend.dto.RegisterRequestDto;
import com.groceryapp.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto requestDto) {
        log.info("Received registration request for email: {}", requestDto.getEmail());
        AuthResponseDto response = authService.register(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto requestDto) {
        log.info("Received login request for email: {}", requestDto.getEmail());
        AuthResponseDto response = authService.login(requestDto);
        return ResponseEntity.ok(response);
    }
}
