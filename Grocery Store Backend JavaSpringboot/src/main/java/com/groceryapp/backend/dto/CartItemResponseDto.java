package com.groceryapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDto {
    
    private UUID cartItemId;
    private UUID productId;
    private String productName;
    private Integer quantity;
    private BigDecimal priceAtAdd;
    private BigDecimal totalPrice; // quantity * priceAtAdd
}