package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.*;
import com.groceryapp.backend.exception.CartItemNotFoundException;
import com.groceryapp.backend.exception.InsufficientStockException;
import com.groceryapp.backend.model.Cart;
import com.groceryapp.backend.model.CartItem;
import com.groceryapp.backend.model.Product;
import com.groceryapp.backend.repository.CartItemRepository;
import com.groceryapp.backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CartService {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    
    @Transactional(readOnly = true)
    public CartResponseDto getOrCreateCart(UUID userId) {
        log.info("Getting or creating cart for user: {}", userId);
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    log.info("Creating new cart for user: {}", userId);
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });
        
        return mapToResponseDto(cart);
    }
    
    public CartResponseDto addItemToCart(UUID userId, AddToCartRequestDto requestDto) {
        log.info("Adding item to cart for user: {}, productId: {}, quantity: {}", 
                userId, requestDto.getProductId(), requestDto.getQuantity());
        
        // Validate product exists and has sufficient stock
        Product product = productService.getProductEntityById(requestDto.getProductId());
        
        if (product.getStock() < requestDto.getQuantity()) {
            throw new InsufficientStockException(
                    product.getName(), 
                    requestDto.getQuantity(), 
                    product.getStock()
            );
        }
        
        // Get or create cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });
        
        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProductId(cart, requestDto.getProductId());
        
        if (existingItem.isPresent()) {
            // Update existing item quantity
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + requestDto.getQuantity();
            
            if (product.getStock() < newQuantity) {
                throw new InsufficientStockException(
                        product.getName(), 
                        newQuantity, 
                        product.getStock()
                );
            }
            
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
            log.info("Updated existing cart item quantity to: {}", newQuantity);
        } else {
            // Create new cart item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProductId(requestDto.getProductId());
            newItem.setQuantity(requestDto.getQuantity());
            newItem.setPriceAtAdd(product.getPrice());
            
            cartItemRepository.save(newItem);
            cart.addItem(newItem);
            log.info("Created new cart item for product: {}", product.getName());
        }
        
        Cart updatedCart = cartRepository.save(cart);
        return mapToResponseDto(updatedCart);
    }
    
    public CartResponseDto updateCartItem(UUID userId, UUID itemId, UpdateCartItemRequestDto requestDto) {
        log.info("Updating cart item: {} for user: {} with quantity: {}", 
                itemId, userId, requestDto.getQuantity());
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart not found for user: " + userId));
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException(itemId));
        
        // Verify the cart item belongs to the user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new CartItemNotFoundException("Cart item does not belong to user's cart");
        }
        
        // Validate product stock
        Product product = productService.getProductEntityById(cartItem.getProductId());
        
        if (product.getStock() < requestDto.getQuantity()) {
            throw new InsufficientStockException(
                    product.getName(), 
                    requestDto.getQuantity(), 
                    product.getStock()
            );
        }
        
        cartItem.setQuantity(requestDto.getQuantity());
        cartItemRepository.save(cartItem);
        
        Cart updatedCart = cartRepository.save(cart);
        log.info("Updated cart item quantity to: {}", requestDto.getQuantity());
        
        return mapToResponseDto(updatedCart);
    }
    
    public CartResponseDto updateCartItemById(UUID itemId, UpdateCartItemRequestDto requestDto) {
        log.info("Updating cart item: {} with quantity: {}", itemId, requestDto.getQuantity());
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException(itemId));
        
        // Validate product stock
        Product product = productService.getProductEntityById(cartItem.getProductId());
        
        if (product.getStock() < requestDto.getQuantity()) {
            throw new InsufficientStockException(
                    product.getName(), 
                    requestDto.getQuantity(), 
                    product.getStock()
            );
        }
        
        cartItem.setQuantity(requestDto.getQuantity());
        cartItemRepository.save(cartItem);
        
        Cart cart = cartItem.getCart();
        Cart updatedCart = cartRepository.save(cart);
        log.info("Updated cart item quantity to: {}", requestDto.getQuantity());
        
        return mapToResponseDto(updatedCart);
    }
    
    public void removeItemFromCart(UUID itemId) {
        log.info("Removing cart item: {}", itemId);
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException(itemId));
        
        Cart cart = cartItem.getCart();
        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);
        
        cartRepository.save(cart);
        log.info("Removed cart item successfully");
    }
    
    public void clearCart(UUID userId) {
        log.info("Clearing cart for user: {}", userId);
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart not found for user: " + userId));
        
        cartItemRepository.deleteByCart(cart);
        cart.getItems().clear();
        cartRepository.save(cart);
        
        log.info("Cart cleared successfully for user: {}", userId);
    }
    
    private CartResponseDto mapToResponseDto(Cart cart) {
        List<CartItemResponseDto> itemDtos = cart.getItems().stream()
                .map(this::mapToCartItemResponseDto)
                .collect(Collectors.toList());
        
        BigDecimal totalPrice = itemDtos.stream()
                .map(CartItemResponseDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        int totalItems = itemDtos.size();
        
        CartResponseDto responseDto = new CartResponseDto();
        responseDto.setCartId(cart.getId());
        responseDto.setUserId(cart.getUserId());
        responseDto.setItems(itemDtos);
        responseDto.setTotalPrice(totalPrice);
        responseDto.setTotalItems(totalItems);
        responseDto.setCreatedAt(cart.getCreatedAt());
        responseDto.setUpdatedAt(cart.getUpdatedAt());
        
        return responseDto;
    }
    
    private CartItemResponseDto mapToCartItemResponseDto(CartItem cartItem) {
        Product product = productService.getProductEntityById(cartItem.getProductId());
        BigDecimal totalPrice = cartItem.getPriceAtAdd().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
        
        CartItemResponseDto responseDto = new CartItemResponseDto();
        responseDto.setCartItemId(cartItem.getId());
        responseDto.setProductId(cartItem.getProductId());
        responseDto.setProductName(product.getName());
        responseDto.setQuantity(cartItem.getQuantity());
        responseDto.setPriceAtAdd(cartItem.getPriceAtAdd());
        responseDto.setTotalPrice(totalPrice);
        
        return responseDto;
    }
}