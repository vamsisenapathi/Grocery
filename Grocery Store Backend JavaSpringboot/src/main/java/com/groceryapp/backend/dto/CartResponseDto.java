package com.groceryapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {
    
    private UUID cartId;
    private UUID userId;
    private List<CartItemResponseDto> items;
    private BigDecimal totalPrice;
    private Integer totalItems;
    private Instant createdAt;
    private Instant updatedAt;
}