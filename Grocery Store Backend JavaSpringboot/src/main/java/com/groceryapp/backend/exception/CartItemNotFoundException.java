package com.groceryapp.backend.exception;

import java.util.UUID;

public class CartItemNotFoundException extends RuntimeException {
    
    public CartItemNotFoundException(UUID itemId) {
        super("Cart item not found with ID: " + itemId);
    }
    
    public CartItemNotFoundException(String message) {
        super(message);
    }
}