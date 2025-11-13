package com.groceryapp.backend.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class OrderTest {

    @Test
    void testOrderCreation() {
        Order order = new Order();
        order.setId(UUID.randomUUID());
        order.setUserId(UUID.randomUUID());
        order.setOrderNumber("ORD-12345");
        order.setTotalAmount(BigDecimal.valueOf(100.00));
        order.setStatus("PENDING");

        assertThat(order.getId()).isNotNull();
        assertThat(order.getUserId()).isNotNull();
        assertThat(order.getOrderNumber()).isEqualTo("ORD-12345");
        assertThat(order.getTotalAmount()).isEqualByComparingTo("100.00");
        assertThat(order.getStatus()).isEqualTo("PENDING");
    }

    @Test
    void testAddItemToOrder() {
        Order order = new Order();
        order.setUserId(UUID.randomUUID());

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProductId(UUID.randomUUID());
        item.setQuantity(3);
        item.setPriceAtOrder(BigDecimal.valueOf(20.00));
        item.setTotalPrice(BigDecimal.valueOf(60.00));

        order.getItems().add(item);

        assertThat(order.getItems()).hasSize(1);
        assertThat(order.getItems().get(0).getQuantity()).isEqualTo(3);
    }

    @Test
    void testOrderStatusChange() {
        Order order = new Order();
        order.setStatus("PENDING");
        assertThat(order.getStatus()).isEqualTo("PENDING");

        order.setStatus("CONFIRMED");
        assertThat(order.getStatus()).isEqualTo("CONFIRMED");

        order.setStatus("SHIPPED");
        assertThat(order.getStatus()).isEqualTo("SHIPPED");
    }

    @Test
    void testOrderWithPaymentMethod() {
        Order order = new Order();
        order.setPaymentMethod("CREDIT_CARD");

        assertThat(order.getPaymentMethod()).isEqualTo("CREDIT_CARD");
    }

    @Test
    void testOrderWithPaymentStatus() {
        Order order = new Order();
        order.setPaymentStatus("PAID");

        assertThat(order.getPaymentStatus()).isEqualTo("PAID");
    }

    @Test
    void testAddItemMethod() {
        Order order = new Order();
        order.setUserId(UUID.randomUUID());

        OrderItem item = new OrderItem();
        item.setProductId(UUID.randomUUID());
        item.setQuantity(2);
        item.setPriceAtOrder(BigDecimal.valueOf(15.00));

        order.addItem(item);

        assertThat(order.getItems()).hasSize(1);
        assertThat(item.getOrder()).isEqualTo(order);
    }

    @Test
    void testRemoveItemMethod() {
        Order order = new Order();
        order.setUserId(UUID.randomUUID());

        OrderItem item = new OrderItem();
        item.setProductId(UUID.randomUUID());
        
        order.addItem(item);
        assertThat(order.getItems()).hasSize(1);

        order.removeItem(item);
        assertThat(order.getItems()).isEmpty();
        assertThat(item.getOrder()).isNull();
    }

    @Test
    void testAllArgsConstructor() {
        UUID id = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String orderNumber = "ORD-999";
        BigDecimal total = BigDecimal.valueOf(200.00);

        Order order = new Order(id, userId, orderNumber, null, total, "PENDING", "COD", "PENDING",
                "John Doe", "9876543210", "123 Main St", "Mumbai", "Maharashtra", "400001",
                null, null, null);

        assertThat(order.getId()).isEqualTo(id);
        assertThat(order.getUserId()).isEqualTo(userId);
        assertThat(order.getOrderNumber()).isEqualTo(orderNumber);
        assertThat(order.getTotalAmount()).isEqualByComparingTo("200.00");
        assertThat(order.getDeliveryName()).isEqualTo("John Doe");
    }

    @Test
    void testNoArgsConstructor() {
        Order order = new Order();
        assertThat(order).isNotNull();
        assertThat(order.getId()).isNull();
        assertThat(order.getItems()).isEmpty();
    }

    @Test
    void testDeliveryAddressFields() {
        Order order = new Order();
        order.setDeliveryName("Jane Smith");
        order.setDeliveryPhone("8765432109");
        order.setDeliveryAddress("456 Oak Avenue");
        order.setDeliveryCity("Delhi");
        order.setDeliveryState("Delhi");
        order.setDeliveryPincode("110001");

        assertThat(order.getDeliveryName()).isEqualTo("Jane Smith");
        assertThat(order.getDeliveryPhone()).isEqualTo("8765432109");
        assertThat(order.getDeliveryAddress()).isEqualTo("456 Oak Avenue");
        assertThat(order.getDeliveryCity()).isEqualTo("Delhi");
        assertThat(order.getDeliveryState()).isEqualTo("Delhi");
        assertThat(order.getDeliveryPincode()).isEqualTo("110001");
    }
}
