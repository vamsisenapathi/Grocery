package com.groceryapp.backend.controller;

import com.groceryapp.backend.dto.AddToCartRequestDto;
import com.groceryapp.backend.dto.CartResponseDto;
import com.groceryapp.backend.dto.UpdateCartItemRequestDto;
import com.groceryapp.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponseDto> getCart(@PathVariable UUID userId) {
        log.info("Received request to get cart for user: {}", userId);
        CartResponseDto cart = cartService.getOrCreateCart(userId);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/items")
    public ResponseEntity<CartResponseDto> addItemToCart(
            @Valid @RequestBody AddToCartRequestDto requestDto) {
        
        log.info("Received request to add item to cart for user: {}", requestDto.getUserId());
        CartResponseDto cart = cartService.addItemToCart(requestDto.getUserId(), requestDto);
        return new ResponseEntity<>(cart, HttpStatus.CREATED);
    }
    
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDto> updateCartItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateCartItemRequestDto requestDto) {
        
        log.info("Received request to update cart item: {}", itemId);
        CartResponseDto cart = cartService.updateCartItemById(itemId, requestDto);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable UUID itemId) {
        
        log.info("Received request to remove cart item: {}", itemId);
        cartService.removeItemFromCart(itemId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable UUID userId) {
        log.info("Received request to clear cart for user: {}", userId);
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}