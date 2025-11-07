package com.groceryapp.backend.controller;

import com.groceryapp.backend.dto.CreateOrderRequestDto;
import com.groceryapp.backend.dto.OrderResponseDto;
import com.groceryapp.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(@Valid @RequestBody CreateOrderRequestDto requestDto) {
        log.info("Received request to create order for user: {}", requestDto.getUserId());
        OrderResponseDto order = orderService.createOrder(requestDto);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDto>> getUserOrders(@PathVariable UUID userId) {
        log.info("Received request to get orders for user: {}", userId);
        List<OrderResponseDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable UUID id) {
        log.info("Received request to get order with ID: {}", id);
        OrderResponseDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/order-number/{orderNumber}")
    public ResponseEntity<OrderResponseDto> getOrderByOrderNumber(@PathVariable String orderNumber) {
        log.info("Received request to get order with order number: {}", orderNumber);
        OrderResponseDto order = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(order);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        log.info("Received request to update order {} status to: {}", id, status);
        OrderResponseDto order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }
    
    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderResponseDto> cancelOrder(@PathVariable UUID id) {
        log.info("Received request to cancel order: {}", id);
        OrderResponseDto order = orderService.cancelOrder(id);
        return ResponseEntity.ok(order);
    }
}
