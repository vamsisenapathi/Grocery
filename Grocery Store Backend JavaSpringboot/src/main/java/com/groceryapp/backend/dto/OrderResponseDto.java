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
public class OrderResponseDto {
    
    private UUID id;
    private UUID userId;
    private String orderNumber;
    private List<OrderItemResponseDto> items;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private DeliveryAddressDto deliveryAddress;
    private Instant deliveredAt;
    private Instant createdAt;
    private Instant updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponseDto {
        private UUID id;
        private UUID productId;
        private String productName;
        private Integer quantity;
        private BigDecimal priceAtOrder;
        private BigDecimal totalPrice;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryAddressDto {
        private String name;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String pincode;
    }
}
