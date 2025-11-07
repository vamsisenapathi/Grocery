package com.groceryapp.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
    
    @NotNull(message = "Product ID cannot be null")
    @Column(name = "product_id", nullable = false)
    private UUID productId;
    
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @NotNull(message = "Price at add cannot be null")
    @Column(name = "price_at_add", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtAdd;
    
    // Constructor for easier creation
    public CartItem(Cart cart, UUID productId, Integer quantity, BigDecimal priceAtAdd) {
        this.cart = cart;
        this.productId = productId;
        this.quantity = quantity;
        this.priceAtAdd = priceAtAdd;
    }
}