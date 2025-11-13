package com.groceryapp.backend.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class OrderItemTest {

    @Test
    void testOrderItemCreation() {
        OrderItem item = new OrderItem();
        item.setId(UUID.randomUUID());
        item.setProductId(UUID.randomUUID());
        item.setProductName("Test Product");
        item.setQuantity(2);
        item.setPriceAtOrder(BigDecimal.valueOf(50.00));
        item.setTotalPrice(BigDecimal.valueOf(100.00));

        assertThat(item.getId()).isNotNull();
        assertThat(item.getProductId()).isNotNull();
        assertThat(item.getProductName()).isEqualTo("Test Product");
        assertThat(item.getQuantity()).isEqualTo(2);
        assertThat(item.getPriceAtOrder()).isEqualByComparingTo("50.00");
        assertThat(item.getTotalPrice()).isEqualByComparingTo("100.00");
    }

    @Test
    void testOrderItemRelationship() {
        Order order = new Order();
        order.setId(UUID.randomUUID());

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProductId(UUID.randomUUID());

        assertThat(item.getOrder()).isEqualTo(order);
        assertThat(item.getOrder().getId()).isEqualTo(order.getId());
    }

    @Test
    void testOrderItemQuantityAndTotal() {
        OrderItem item = new OrderItem();
        item.setPriceAtOrder(BigDecimal.valueOf(25.00));
        item.setQuantity(3);
        item.setTotalPrice(BigDecimal.valueOf(75.00));

        assertThat(item.getTotalPrice()).isEqualByComparingTo("75.00");
    }

    @Test
    void testAllArgsConstructor() {
        UUID id = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        String productName = "Laptop";
        BigDecimal priceAtOrder = BigDecimal.valueOf(999.99);
        BigDecimal totalPrice = BigDecimal.valueOf(999.99);

        OrderItem item = new OrderItem(id, null, productId, productName, 1, priceAtOrder, totalPrice);

        assertThat(item.getId()).isEqualTo(id);
        assertThat(item.getProductId()).isEqualTo(productId);
        assertThat(item.getProductName()).isEqualTo(productName);
        assertThat(item.getQuantity()).isEqualTo(1);
        assertThat(item.getPriceAtOrder()).isEqualTo(priceAtOrder);
        assertThat(item.getTotalPrice()).isEqualTo(totalPrice);
    }
}
