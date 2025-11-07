package com.groceryapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    
    private String token;
    private String tokenType = "Bearer";
    private UUID userId;
    private String name;
    private String email;
    private String phoneNumber;
    private Instant createdAt;
    private String message;
    
    // Constructor without tokenType (will default to "Bearer")
    public AuthResponseDto(String token, UUID userId, String name, String email, 
                          String phoneNumber, Instant createdAt, String message) {
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
        this.message = message;
    }
}
