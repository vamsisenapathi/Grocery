package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.CreateOrderRequestDto;
import com.groceryapp.backend.dto.OrderResponseDto;
import com.groceryapp.backend.exception.AddressNotFoundException;
import com.groceryapp.backend.exception.InsufficientStockException;
import com.groceryapp.backend.exception.OrderNotFoundException;
import com.groceryapp.backend.model.Address;
import com.groceryapp.backend.model.Order;
import com.groceryapp.backend.model.OrderItem;
import com.groceryapp.backend.model.Product;
import com.groceryapp.backend.repository.AddressRepository;
import com.groceryapp.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final ProductService productService;
    
    @Transactional
    public OrderResponseDto createOrder(CreateOrderRequestDto requestDto) {
        log.info("Creating order for user: {}", requestDto.getUserId());
        
        // Validate items
        if (requestDto.getItems() == null || requestDto.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart items cannot be empty");
        }
        
        // Fetch delivery address
        Address deliveryAddress = addressRepository.findById(requestDto.getDeliveryAddressId())
                .orElseThrow(() -> new AddressNotFoundException(requestDto.getDeliveryAddressId()));
        
        // Normalize payment method to uppercase
        String normalizedPaymentMethod = requestDto.getPaymentMethod().toUpperCase();
        
        // Create order
        Order order = new Order();
        order.setUserId(requestDto.getUserId());
        order.setOrderNumber(generateOrderNumber());
        order.setStatus("PENDING");
        order.setPaymentMethod(normalizedPaymentMethod);
        order.setPaymentStatus(normalizedPaymentMethod.equals("COD") ? "PENDING" : "PENDING");
        
        // Set delivery address
        order.setDeliveryName(deliveryAddress.getFullName());
        order.setDeliveryPhone(deliveryAddress.getPhoneNumber());
        order.setDeliveryAddress(deliveryAddress.getAddressLine1() + 
                (deliveryAddress.getAddressLine2() != null ? ", " + deliveryAddress.getAddressLine2() : ""));
        order.setDeliveryCity(deliveryAddress.getCity());
        order.setDeliveryState(deliveryAddress.getState());
        order.setDeliveryPincode(deliveryAddress.getPincode());
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Add order items
        for (CreateOrderRequestDto.OrderItemDto itemDto : requestDto.getItems()) {
            Product product = productService.getProductEntityById(itemDto.getProductId());
            
            // Check stock
            if (product.getStock() < itemDto.getQuantity()) {
                throw new InsufficientStockException(
                        product.getName(),
                        itemDto.getQuantity(),
                        product.getStock()
                );
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPriceAtOrder(product.getPrice());
            orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
            
            order.addItem(orderItem);
            totalAmount = totalAmount.add(orderItem.getTotalPrice());
            
            // Update product stock
            product.setStock(product.getStock() - itemDto.getQuantity());
            productService.updateProductStock(product);
        }
        
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);
        
        log.info("Order created successfully with order number: {}", savedOrder.getOrderNumber());
        return mapToResponseDto(savedOrder);
    }
    
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getUserOrders(UUID userId) {
        log.info("Fetching orders for user: {}", userId);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(UUID orderId) {
        log.info("Fetching order with ID: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        return mapToResponseDto(order);
    }
    
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByOrderNumber(String orderNumber) {
        log.info("Fetching order with order number: {}", orderNumber);
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with order number: " + orderNumber));
        return mapToResponseDto(order);
    }
    
    @Transactional
    public OrderResponseDto updateOrderStatus(UUID orderId, String status) {
        log.info("Updating order {} status to: {}", orderId, status);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        order.setStatus(status);
        
        if (status.equals("DELIVERED")) {
            order.setDeliveredAt(Instant.now());
        }
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Order status updated successfully");
        
        return mapToResponseDto(updatedOrder);
    }
    
    @Transactional
    public OrderResponseDto cancelOrder(UUID orderId) {
        log.info("Cancelling order: {}", orderId);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        if (order.getStatus().equals("DELIVERED") || order.getStatus().equals("CANCELLED")) {
            throw new IllegalStateException("Cannot cancel order with status: " + order.getStatus());
        }
        
        // Restore product stock
        for (OrderItem item : order.getItems()) {
            Product product = productService.getProductEntityById(item.getProductId());
            product.setStock(product.getStock() + item.getQuantity());
            productService.updateProductStock(product);
        }
        
        order.setStatus("CANCELLED");
        Order updatedOrder = orderRepository.save(order);
        
        log.info("Order cancelled successfully");
        return mapToResponseDto(updatedOrder);
    }
    
    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private OrderResponseDto mapToResponseDto(Order order) {
        List<OrderResponseDto.OrderItemResponseDto> itemDtos = order.getItems().stream()
                .map(item -> new OrderResponseDto.OrderItemResponseDto(
                        item.getId(),
                        item.getProductId(),
                        item.getProductName(),
                        item.getQuantity(),
                        item.getPriceAtOrder(),
                        item.getTotalPrice()
                ))
                .collect(Collectors.toList());
        
        OrderResponseDto.DeliveryAddressDto addressDto = new OrderResponseDto.DeliveryAddressDto(
                order.getDeliveryName(),
                order.getDeliveryPhone(),
                order.getDeliveryAddress(),
                order.getDeliveryCity(),
                order.getDeliveryState(),
                order.getDeliveryPincode()
        );
        
        return new OrderResponseDto(
                order.getId(),
                order.getUserId(),
                order.getOrderNumber(),
                itemDtos,
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                addressDto,
                order.getDeliveredAt(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
