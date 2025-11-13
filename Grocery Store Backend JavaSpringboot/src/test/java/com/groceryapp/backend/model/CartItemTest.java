package com.groceryapp.backend.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class CartItemTest {

    @Test
    void testCartItemCreation() {
        CartItem item = new CartItem();
        item.setId(UUID.randomUUID());
        item.setProductId(UUID.randomUUID());
        item.setQuantity(3);
        item.setPriceAtAdd(BigDecimal.valueOf(15.99));

        assertThat(item.getId()).isNotNull();
        assertThat(item.getProductId()).isNotNull();
        assertThat(item.getQuantity()).isEqualTo(3);
        assertThat(item.getPriceAtAdd()).isEqualByComparingTo("15.99");
    }

    @Test
    void testCartItemRelationship() {
        Cart cart = new Cart();
        cart.setId(UUID.randomUUID());

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProductId(UUID.randomUUID());

        assertThat(item.getCart()).isEqualTo(cart);
        assertThat(item.getCart().getId()).isEqualTo(cart.getId());
    }

    @Test
    void testAllArgsConstructor() {
        UUID id = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        BigDecimal price = BigDecimal.valueOf(25.50);
        
        CartItem item = new CartItem(id, null, productId, 5, price);

        assertThat(item.getId()).isEqualTo(id);
        assertThat(item.getProductId()).isEqualTo(productId);
        assertThat(item.getQuantity()).isEqualTo(5);
        assertThat(item.getPriceAtAdd()).isEqualTo(price);
    }

    @Test
    void testCustomConstructor() {
        Cart cart = new Cart();
        cart.setId(UUID.randomUUID());
        UUID productId = UUID.randomUUID();
        BigDecimal price = BigDecimal.valueOf(19.99);

        CartItem item = new CartItem(cart, productId, 2, price);

        assertThat(item.getCart()).isEqualTo(cart);
        assertThat(item.getProductId()).isEqualTo(productId);
        assertThat(item.getQuantity()).isEqualTo(2);
        assertThat(item.getPriceAtAdd()).isEqualByComparingTo("19.99");
    }

    @Test
    void testNoArgsConstructor() {
        CartItem item = new CartItem();
        assertThat(item).isNotNull();
        assertThat(item.getId()).isNull();
        assertThat(item.getQuantity()).isNull();
    }

    @Test
    void testGettersAndSetters() {
        CartItem item = new CartItem();
        UUID id = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        Cart cart = new Cart();
        BigDecimal price = BigDecimal.valueOf(10.50);

        item.setId(id);
        item.setCart(cart);
        item.setProductId(productId);
        item.setQuantity(4);
        item.setPriceAtAdd(price);

        assertThat(item.getId()).isEqualTo(id);
        assertThat(item.getCart()).isEqualTo(cart);
        assertThat(item.getProductId()).isEqualTo(productId);
        assertThat(item.getQuantity()).isEqualTo(4);
        assertThat(item.getPriceAtAdd()).isEqualTo(price);
    }
}
