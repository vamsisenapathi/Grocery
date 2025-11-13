package com.groceryapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDto {
    
    @NotNull(message = "User ID cannot be null")
    private UUID userId;
    
    @NotNull(message = "Cart items cannot be null")
    private List<OrderItemDto> items;
    
    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "(?i)(COD|CARD|UPI|wallet|card|netbanking|upi|cod)", 
             message = "Payment method must be COD, CARD, UPI, wallet, netbanking, or similar")
    private String paymentMethod;
    
    @NotNull(message = "Delivery address ID is required")
    private UUID deliveryAddressId;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        @NotNull(message = "Product ID cannot be null")
        private UUID productId;
        
        @NotNull(message = "Quantity cannot be null")
        private Integer quantity;
    }
}
