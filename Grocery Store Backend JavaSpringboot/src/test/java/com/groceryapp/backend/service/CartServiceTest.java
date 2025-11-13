package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.AddToCartRequestDto;
import com.groceryapp.backend.dto.CartResponseDto;
import com.groceryapp.backend.dto.UpdateCartItemRequestDto;
import com.groceryapp.backend.exception.CartItemNotFoundException;
import com.groceryapp.backend.exception.InsufficientStockException;
import com.groceryapp.backend.model.Cart;
import com.groceryapp.backend.model.CartItem;
import com.groceryapp.backend.model.Product;
import com.groceryapp.backend.repository.CartItemRepository;
import com.groceryapp.backend.repository.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private CartService cartService;

    private UUID userId;
    private UUID productId;
    private UUID cartId;
    private UUID cartItemId;
    private Cart testCart;
    private CartItem testCartItem;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        productId = UUID.randomUUID();
        cartId = UUID.randomUUID();
        cartItemId = UUID.randomUUID();

        testProduct = new Product();
        testProduct.setId(productId);
        testProduct.setName("Test Product");
        testProduct.setPrice(BigDecimal.valueOf(10.00));
        testProduct.setStock(50);

        testCart = new Cart();
        testCart.setId(cartId);
        testCart.setUserId(userId);
        testCart.setItems(new ArrayList<>());

        testCartItem = new CartItem();
        testCartItem.setId(cartItemId);
        testCartItem.setCart(testCart);
        testCartItem.setProductId(productId);
        testCartItem.setQuantity(2);
        testCartItem.setPriceAtAdd(BigDecimal.valueOf(10.00));
        testCart.addItem(testCartItem);
    }

    @Test
    void getOrCreateCart_WhenCartExists_ShouldReturnExistingCart() {
        // Arrange
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(testCart));
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);

        // Act
        CartResponseDto result = cartService.getOrCreateCart(userId);

        // Assert
        assertThat(result).isNotNull();
        verify(cartRepository, times(1)).findByUserId(userId);
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    void getOrCreateCart_WhenCartDoesNotExist_ShouldCreateNewCart() {
        // Arrange
        Cart newCart = new Cart();
        newCart.setId(cartId);
        newCart.setUserId(userId);
        newCart.setItems(new ArrayList<>());
        
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(newCart);

        // Act
        CartResponseDto result = cartService.getOrCreateCart(userId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getTotalItems()).isEqualTo(0);
        verify(cartRepository, times(1)).findByUserId(userId);
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    void addItemToCart_WithValidData_ShouldAddNewItem() {
        // Arrange
        AddToCartRequestDto requestDto = new AddToCartRequestDto();
        requestDto.setProductId(productId);
        requestDto.setQuantity(3);
        requestDto.setUserId(userId);

        when(productService.getProductEntityById(productId)).thenReturn(testProduct);
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartAndProductId(testCart, productId)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(testCartItem);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartResponseDto result = cartService.addItemToCart(userId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    void addItemToCart_WhenItemExists_ShouldUpdateQuantity() {
        // Arrange
        AddToCartRequestDto requestDto = new AddToCartRequestDto();
        requestDto.setProductId(productId);
        requestDto.setQuantity(3);
        requestDto.setUserId(userId);

        when(productService.getProductEntityById(productId)).thenReturn(testProduct);
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartAndProductId(testCart, productId)).thenReturn(Optional.of(testCartItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(testCartItem);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartResponseDto result = cartService.addItemToCart(userId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(cartItemRepository, times(1)).save(testCartItem);
        assertThat(testCartItem.getQuantity()).isEqualTo(5); // 2 existing + 3 new
    }

    @Test
    void addItemToCart_WithInsufficientStock_ShouldThrowException() {
        // Arrange
        AddToCartRequestDto requestDto = new AddToCartRequestDto();
        requestDto.setProductId(productId);
        requestDto.setQuantity(100); // More than available stock
        requestDto.setUserId(userId);

        testProduct.setStock(50);
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);

        // Act & Assert
        assertThatThrownBy(() -> cartService.addItemToCart(userId, requestDto))
                .isInstanceOf(InsufficientStockException.class);
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void updateCartItemById_WithValidData_ShouldUpdateQuantity() {
        // Arrange
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(5);

        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(testCartItem));
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(testCartItem);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartResponseDto result = cartService.updateCartItemById(cartItemId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(cartItemRepository, times(1)).save(testCartItem);
        assertThat(testCartItem.getQuantity()).isEqualTo(5);
    }

    @Test
    void updateCartItemById_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(5);

        when(cartItemRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> cartService.updateCartItemById(invalidId, requestDto))
                .isInstanceOf(CartItemNotFoundException.class);
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void updateCartItemById_WithInsufficientStock_ShouldThrowException() {
        // Arrange
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(100); // More than available stock

        testProduct.setStock(50);
        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(testCartItem));
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);

        // Act & Assert
        assertThatThrownBy(() -> cartService.updateCartItemById(cartItemId, requestDto))
                .isInstanceOf(InsufficientStockException.class);
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void removeItemFromCart_WithValidId_ShouldRemoveItem() {
        // Arrange
        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(testCartItem));
        doNothing().when(cartItemRepository).delete(testCartItem);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        cartService.removeItemFromCart(cartItemId);

        // Assert
        verify(cartItemRepository, times(1)).delete(testCartItem);
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    void removeItemFromCart_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(cartItemRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> cartService.removeItemFromCart(invalidId))
                .isInstanceOf(CartItemNotFoundException.class);
        verify(cartItemRepository, never()).delete(any(CartItem.class));
    }

    @Test
    void clearCart_WithValidUserId_ShouldClearAllItems() {
        // Arrange
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(testCart));
        doNothing().when(cartItemRepository).deleteByCart(testCart);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        cartService.clearCart(userId);

        // Assert
        verify(cartItemRepository, times(1)).deleteByCart(testCart);
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    void clearCart_WhenCartDoesNotExist_ShouldThrowException() {
        // Arrange
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> cartService.clearCart(userId))
                .isInstanceOf(CartItemNotFoundException.class);
        
        verify(cartItemRepository, never()).deleteByCart(any());
    }

    // ========== NEW TESTS FOR BRANCH COVERAGE ==========

    @Test
    void addItemToCart_WhenCartDoesNotExist_ShouldCreateNewCart() {
        // Arrange
        AddToCartRequestDto requestDto = new AddToCartRequestDto();
        requestDto.setProductId(productId);
        requestDto.setQuantity(3);
        requestDto.setUserId(userId);

        Cart newCart = new Cart();
        newCart.setId(cartId);
        newCart.setUserId(userId);
        newCart.setItems(new ArrayList<>());

        when(productService.getProductEntityById(productId)).thenReturn(testProduct);
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(newCart, testCart);
        when(cartItemRepository.findByCartAndProductId(any(Cart.class), eq(productId))).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(testCartItem);

        // Act
        CartResponseDto result = cartService.addItemToCart(userId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(cartRepository, times(2)).save(any(Cart.class)); // Once for new cart, once for update
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    void addItemToCart_WhenExistingItemHasInsufficientStockForUpdate_ShouldThrowException() {
        // Arrange
        AddToCartRequestDto requestDto = new AddToCartRequestDto();
        requestDto.setProductId(productId);
        requestDto.setQuantity(3);
        requestDto.setUserId(userId);

        testCartItem.setQuantity(48); // Existing quantity
        testProduct.setStock(50); // Total stock: adding 3 would make 51 > 50

        when(productService.getProductEntityById(productId)).thenReturn(testProduct);
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartAndProductId(testCart, productId)).thenReturn(Optional.of(testCartItem));

        // Act & Assert
        assertThatThrownBy(() -> cartService.addItemToCart(userId, requestDto))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Test Product")
                .hasMessageContaining("51")
                .hasMessageContaining("50");

        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void updateCartItem_WhenCartNotFound_ShouldThrowException() {
        // Arrange
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(5);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> cartService.updateCartItem(userId, cartItemId, requestDto))
                .isInstanceOf(CartItemNotFoundException.class)
                .hasMessageContaining("Cart not found for user");

        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void updateCartItem_WhenCartItemNotFound_ShouldThrowException() {
        // Arrange
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(5);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> cartService.updateCartItem(userId, cartItemId, requestDto))
                .isInstanceOf(CartItemNotFoundException.class);

        verify(productService, never()).getProductEntityById(any());
    }

    @Test
    void updateCartItem_WhenCartItemDoesNotBelongToUserCart_ShouldThrowException() {
        // Arrange
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(5);

        Cart differentCart = new Cart();
        differentCart.setId(UUID.randomUUID()); // Different cart ID
        differentCart.setUserId(userId);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(differentCart));
        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(testCartItem));

        // Act & Assert
        assertThatThrownBy(() -> cartService.updateCartItem(userId, cartItemId, requestDto))
                .isInstanceOf(CartItemNotFoundException.class)
                .hasMessageContaining("Cart item does not belong to user's cart");

        verify(productService, never()).getProductEntityById(any());
    }

    @Test
    void updateCartItem_WithValidData_ShouldUpdateQuantity() {
        // Arrange
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(7);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(testCartItem));
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(testCartItem);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartResponseDto result = cartService.updateCartItem(userId, cartItemId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(testCartItem.getQuantity()).isEqualTo(7);
        verify(cartItemRepository, times(1)).save(testCartItem);
        verify(cartRepository, times(1)).save(testCart);
    }

    @Test
    void updateCartItem_WithInsufficientStock_ShouldThrowException() {
        // Arrange
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(100);

        testProduct.setStock(50);

        when(cartRepository.findByUserId(userId)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findById(cartItemId)).thenReturn(Optional.of(testCartItem));
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);

        // Act & Assert
        assertThatThrownBy(() -> cartService.updateCartItem(userId, cartItemId, requestDto))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Test Product")
                .hasMessageContaining("100")
                .hasMessageContaining("50");

        verify(cartItemRepository, never()).save(any(CartItem.class));
    }
}
