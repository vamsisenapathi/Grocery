package com.groceryapp.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groceryapp.backend.dto.AddToCartRequestDto;
import com.groceryapp.backend.dto.CartResponseDto;
import com.groceryapp.backend.dto.UpdateCartItemRequestDto;
import com.groceryapp.backend.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CartService cartService;

    private UUID userId;
    private UUID productId;
    private UUID cartItemId;
    private CartResponseDto cartResponse;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        productId = UUID.randomUUID();
        cartItemId = UUID.randomUUID();
        
        cartResponse = new CartResponseDto();
        cartResponse.setItems(new ArrayList<>());
        cartResponse.setTotalPrice(BigDecimal.valueOf(100.00));
    }

    @Test
    void getCart_ShouldReturnCart() throws Exception {
        when(cartService.getOrCreateCart(userId)).thenReturn(cartResponse);

        mockMvc.perform(get("/cart/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPrice").value(100.00));

        verify(cartService, times(1)).getOrCreateCart(userId);
    }

    @Test
    void addItemToCart_ShouldReturnCreated() throws Exception {
        AddToCartRequestDto requestDto = new AddToCartRequestDto();
        requestDto.setUserId(userId);
        requestDto.setProductId(productId);
        requestDto.setQuantity(2);

        when(cartService.addItemToCart(eq(userId), any(AddToCartRequestDto.class)))
                .thenReturn(cartResponse);

        mockMvc.perform(post("/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalPrice").value(100.00));

        verify(cartService, times(1)).addItemToCart(eq(userId), any(AddToCartRequestDto.class));
    }

    @Test
    void updateCartItem_ShouldReturnUpdatedCart() throws Exception {
        UpdateCartItemRequestDto requestDto = new UpdateCartItemRequestDto();
        requestDto.setQuantity(3);

        when(cartService.updateCartItemById(eq(cartItemId), any(UpdateCartItemRequestDto.class)))
                .thenReturn(cartResponse);

        mockMvc.perform(put("/cart/items/{itemId}", cartItemId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPrice").value(100.00));

        verify(cartService, times(1)).updateCartItemById(eq(cartItemId), any(UpdateCartItemRequestDto.class));
    }

    @Test
    void removeItemFromCart_ShouldReturnNoContent() throws Exception {
        doNothing().when(cartService).removeItemFromCart(cartItemId);

        mockMvc.perform(delete("/cart/items/{itemId}", cartItemId))
                .andExpect(status().isNoContent());

        verify(cartService, times(1)).removeItemFromCart(cartItemId);
    }

    @Test
    void clearCart_ShouldReturnNoContent() throws Exception {
        doNothing().when(cartService).clearCart(userId);

        mockMvc.perform(delete("/cart/{userId}", userId))
                .andExpect(status().isNoContent());

        verify(cartService, times(1)).clearCart(userId);
    }

    @Test
    void addItemToCart_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        AddToCartRequestDto requestDto = new AddToCartRequestDto();
        // Missing required fields

        mockMvc.perform(post("/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest());
    }
}
