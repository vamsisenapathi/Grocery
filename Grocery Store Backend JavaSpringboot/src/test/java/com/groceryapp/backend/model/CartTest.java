package com.groceryapp.backend.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class CartTest {

    @Test
    void testCartCreation() {
        Cart cart = new Cart();
        cart.setId(UUID.randomUUID());
        cart.setUserId(UUID.randomUUID());

        assertThat(cart.getId()).isNotNull();
        assertThat(cart.getUserId()).isNotNull();
        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void testAddItemToCart() {
        Cart cart = new Cart();
        cart.setUserId(UUID.randomUUID());

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProductId(UUID.randomUUID());
        item.setQuantity(2);
        item.setPriceAtAdd(BigDecimal.valueOf(10.00));

        cart.getItems().add(item);

        assertThat(cart.getItems()).hasSize(1);
        assertThat(cart.getItems().get(0).getQuantity()).isEqualTo(2);
    }

    @Test
    void testRemoveItemFromCart() {
        Cart cart = new Cart();
        cart.setUserId(UUID.randomUUID());

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProductId(UUID.randomUUID());
        cart.getItems().add(item);

        cart.getItems().clear();

        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void testAllArgsConstructor() {
        UUID id = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        Cart cart = new Cart(id, userId, null, null, null);

        assertThat(cart.getId()).isEqualTo(id);
        assertThat(cart.getUserId()).isEqualTo(userId);
    }
}
