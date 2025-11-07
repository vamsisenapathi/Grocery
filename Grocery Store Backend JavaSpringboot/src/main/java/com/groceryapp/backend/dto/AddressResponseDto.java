package com.groceryapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponseDto {
    
    private UUID id;
    private UUID userId;
    private String fullName;
    private String phoneNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String addressType;
    private Boolean isDefault;
    private Instant createdAt;
    private Instant updatedAt;
}
