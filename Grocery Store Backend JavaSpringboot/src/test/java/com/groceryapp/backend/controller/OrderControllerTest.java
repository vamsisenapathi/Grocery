package com.groceryapp.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groceryapp.backend.dto.CreateOrderRequestDto;
import com.groceryapp.backend.dto.OrderResponseDto;
import com.groceryapp.backend.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    private CreateOrderRequestDto createOrderRequest;
    private OrderResponseDto orderResponse;
    private UUID orderId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        orderId = UUID.randomUUID();
        userId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        UUID addressId = UUID.randomUUID();

        // Create order item
        CreateOrderRequestDto.OrderItemDto orderItem = new CreateOrderRequestDto.OrderItemDto();
        orderItem.setProductId(productId);
        orderItem.setQuantity(2);

        createOrderRequest = new CreateOrderRequestDto();
        createOrderRequest.setUserId(userId);
        createOrderRequest.setItems(Arrays.asList(orderItem));
        createOrderRequest.setPaymentMethod("COD");
        createOrderRequest.setDeliveryAddressId(addressId);

        orderResponse = new OrderResponseDto();
        orderResponse.setId(orderId);
        orderResponse.setOrderNumber("ORD-12345");
        orderResponse.setUserId(userId);
        orderResponse.setTotalAmount(new BigDecimal("99.99"));
        orderResponse.setStatus("PENDING");
    }

    @Test
    void createOrder_WithValidData_ShouldReturnCreated() throws Exception {
        when(orderService.createOrder(any(CreateOrderRequestDto.class))).thenReturn(orderResponse);

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createOrderRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderNumber").value("ORD-12345"))
                .andExpect(jsonPath("$.status").value("PENDING"));

        verify(orderService, times(1)).createOrder(any(CreateOrderRequestDto.class));
    }

    @Test
    void getUserOrders_WithValidUserId_ShouldReturnOrders() throws Exception {
        List<OrderResponseDto> orders = Arrays.asList(orderResponse);
        when(orderService.getUserOrders(userId)).thenReturn(orders);

        mockMvc.perform(get("/orders/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderNumber").value("ORD-12345"));

        verify(orderService, times(1)).getUserOrders(userId);
    }

    @Test
    void getOrderById_WithValidId_ShouldReturnOrder() throws Exception {
        when(orderService.getOrderById(orderId)).thenReturn(orderResponse);

        mockMvc.perform(get("/orders/{id}", orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(orderId.toString()))
                .andExpect(jsonPath("$.orderNumber").value("ORD-12345"));

        verify(orderService, times(1)).getOrderById(orderId);
    }

    @Test
    void getOrderByOrderNumber_WithValidNumber_ShouldReturnOrder() throws Exception {
        when(orderService.getOrderByOrderNumber("ORD-12345")).thenReturn(orderResponse);

        mockMvc.perform(get("/orders/order-number/{orderNumber}", "ORD-12345"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderNumber").value("ORD-12345"));

        verify(orderService, times(1)).getOrderByOrderNumber("ORD-12345");
    }

    @Test
    void updateOrderStatus_WithValidData_ShouldReturnUpdatedOrder() throws Exception {
        OrderResponseDto updatedOrder = new OrderResponseDto();
        updatedOrder.setId(orderId);
        updatedOrder.setOrderNumber("ORD-12345");
        updatedOrder.setStatus("DELIVERED");

        when(orderService.updateOrderStatus(orderId, "DELIVERED")).thenReturn(updatedOrder);

        mockMvc.perform(patch("/orders/{id}/status", orderId)
                        .param("status", "DELIVERED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"));

        verify(orderService, times(1)).updateOrderStatus(orderId, "DELIVERED");
    }
}
