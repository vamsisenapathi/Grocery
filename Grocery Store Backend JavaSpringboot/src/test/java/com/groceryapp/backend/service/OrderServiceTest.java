package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.CreateOrderRequestDto;
import com.groceryapp.backend.dto.OrderResponseDto;
import com.groceryapp.backend.exception.AddressNotFoundException;
import com.groceryapp.backend.exception.InsufficientStockException;
import com.groceryapp.backend.exception.OrderNotFoundException;
import com.groceryapp.backend.model.Address;
import com.groceryapp.backend.model.Order;
import com.groceryapp.backend.model.Product;
import com.groceryapp.backend.repository.AddressRepository;
import com.groceryapp.backend.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private OrderService orderService;

    private UUID userId;
    private UUID orderId;
    private UUID addressId;
    private UUID productId;
    private Order testOrder;
    private Address testAddress;
    private Product testProduct;
    private CreateOrderRequestDto requestDto;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        orderId = UUID.randomUUID();
        addressId = UUID.randomUUID();
        productId = UUID.randomUUID();

        testAddress = new Address();
        testAddress.setId(addressId);
        testAddress.setFullName("John Doe");
        testAddress.setPhoneNumber("1234567890");
        testAddress.setAddressLine1("123 Main St");
        testAddress.setAddressLine2("Apt 4B");
        testAddress.setCity("New York");
        testAddress.setState("NY");
        testAddress.setPincode("10001");

        testProduct = new Product();
        testProduct.setId(productId);
        testProduct.setName("Test Product");
        testProduct.setPrice(BigDecimal.valueOf(25.00));
        testProduct.setStock(100);

        testOrder = new Order();
        testOrder.setId(orderId);
        testOrder.setUserId(userId);
        testOrder.setOrderNumber("ORD-2024-001");
        testOrder.setStatus("PENDING");
        testOrder.setPaymentMethod("COD");
        testOrder.setTotalAmount(BigDecimal.valueOf(50.00));
        testOrder.setItems(new ArrayList<>());

        requestDto = new CreateOrderRequestDto();
        requestDto.setUserId(userId);
        requestDto.setDeliveryAddressId(addressId);
        requestDto.setPaymentMethod("cod");
        
        CreateOrderRequestDto.OrderItemDto itemDto = new CreateOrderRequestDto.OrderItemDto();
        itemDto.setProductId(productId);
        itemDto.setQuantity(2);
        requestDto.setItems(Arrays.asList(itemDto));
    }

    @Test
    void createOrder_WithValidData_ShouldCreateOrder() {
        // Arrange
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        doNothing().when(productService).updateProductStock(any(Product.class));

        // Act
        OrderResponseDto result = orderService.createOrder(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getOrderNumber()).isNotNull();
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(productService, times(1)).updateProductStock(any(Product.class));
    }

    @Test
    void createOrder_WithEmptyItems_ShouldThrowException() {
        // Arrange
        requestDto.setItems(new ArrayList<>());

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(requestDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cart items cannot be empty");
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrder_WithInvalidAddress_ShouldThrowException() {
        // Arrange
        when(addressRepository.findById(addressId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(requestDto))
                .isInstanceOf(AddressNotFoundException.class);
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrder_WithInsufficientStock_ShouldThrowException() {
        // Arrange
        testProduct.setStock(1); // Less than requested quantity
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(requestDto))
                .isInstanceOf(InsufficientStockException.class);
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrder_WithCreditCardPayment_ShouldNormalizePaymentMethod() {
        // Arrange
        requestDto.setPaymentMethod("credit_card");
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        when(productService.getProductEntityById(productId)).thenReturn(testProduct);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            assertThat(order.getPaymentMethod()).isEqualTo("CREDIT_CARD");
            return testOrder;
        });
        doNothing().when(productService).updateProductStock(any(Product.class));

        // Act
        OrderResponseDto result = orderService.createOrder(requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void getUserOrders_ShouldReturnAllUserOrders() {
        // Arrange
        List<Order> orders = Arrays.asList(testOrder);
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(orders);

        // Act
        List<OrderResponseDto> result = orderService.getUserOrders(userId);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getOrderNumber()).isEqualTo("ORD-2024-001");
        verify(orderRepository, times(1)).findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    void getUserOrders_WhenNoOrders_ShouldReturnEmptyList() {
        // Arrange
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(new ArrayList<>());

        // Act
        List<OrderResponseDto> result = orderService.getUserOrders(userId);

        // Assert
        assertThat(result).isEmpty();
        verify(orderRepository, times(1)).findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Test
    void getOrderById_WithValidId_ShouldReturnOrder() {
        // Arrange
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));

        // Act
        OrderResponseDto result = orderService.getOrderById(orderId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(orderId);
        verify(orderRepository, times(1)).findById(orderId);
    }

    @Test
    void getOrderById_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(orderRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> orderService.getOrderById(invalidId))
                .isInstanceOf(OrderNotFoundException.class);
        verify(orderRepository, times(1)).findById(invalidId);
    }

    @Test
    void getOrderByOrderNumber_WithValidNumber_ShouldReturnOrder() {
        // Arrange
        String orderNumber = "ORD-2024-001";
        when(orderRepository.findByOrderNumber(orderNumber)).thenReturn(Optional.of(testOrder));

        // Act
        OrderResponseDto result = orderService.getOrderByOrderNumber(orderNumber);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getOrderNumber()).isEqualTo(orderNumber);
        verify(orderRepository, times(1)).findByOrderNumber(orderNumber);
    }

    @Test
    void getOrderByOrderNumber_WithInvalidNumber_ShouldThrowException() {
        // Arrange
        String invalidNumber = "INVALID-001";
        when(orderRepository.findByOrderNumber(invalidNumber)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> orderService.getOrderByOrderNumber(invalidNumber))
                .isInstanceOf(OrderNotFoundException.class);
        verify(orderRepository, times(1)).findByOrderNumber(invalidNumber);
    }

    @Test
    void cancelOrder_WithValidId_ShouldCancelOrder() {
        // Arrange
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderResponseDto result = orderService.cancelOrder(orderId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(testOrder.getStatus()).isEqualTo("CANCELLED");
        verify(orderRepository, times(1)).save(testOrder);
    }

    @Test
    void cancelOrder_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(orderRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> orderService.cancelOrder(invalidId))
                .isInstanceOf(OrderNotFoundException.class);
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void updateOrderStatus_ShouldUpdateStatus() {
        // Arrange
        String newStatus = "DELIVERED";
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderResponseDto result = orderService.updateOrderStatus(orderId, newStatus);

        // Assert
        assertThat(result).isNotNull();
        assertThat(testOrder.getStatus()).isEqualTo(newStatus);
        verify(orderRepository, times(1)).save(testOrder);
    }

    // ==================== ADDITIONAL BRANCH COVERAGE TESTS ====================

    @Test
    void createOrder_WithCODPaymentMethod_ShouldSetPendingPaymentStatus() {
        // Arrange
        requestDto.setPaymentMethod("cod");
        when(addressRepository.findById(any(UUID.class))).thenReturn(Optional.of(testAddress));
        when(productService.getProductEntityById(any(UUID.class))).thenReturn(testProduct);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(orderId);
            return order;
        });

        // Act
        OrderResponseDto result = orderService.createOrder(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getPaymentMethod()).isEqualTo("COD");
        assertThat(result.getPaymentStatus()).isEqualTo("PENDING");
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_WithNonCODPaymentMethod_ShouldSetPendingPaymentStatus() {
        // Arrange
        requestDto.setPaymentMethod("online");
        when(addressRepository.findById(any(UUID.class))).thenReturn(Optional.of(testAddress));
        when(productService.getProductEntityById(any(UUID.class))).thenReturn(testProduct);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(orderId);
            return order;
        });

        // Act
        OrderResponseDto result = orderService.createOrder(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getPaymentMethod()).isEqualTo("ONLINE");
        assertThat(result.getPaymentStatus()).isEqualTo("PENDING");
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_WithAddressLine2Null_ShouldHandleGracefully() {
        // Arrange
        testAddress.setAddressLine2(null);
        when(addressRepository.findById(any(UUID.class))).thenReturn(Optional.of(testAddress));
        when(productService.getProductEntityById(any(UUID.class))).thenReturn(testProduct);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(orderId);
            return order;
        });

        // Act
        OrderResponseDto result = orderService.createOrder(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getDeliveryAddress().getAddress()).isEqualTo("123 Main St");
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_WithAddressLine2Present_ShouldConcatenate() {
        // Arrange
        testAddress.setAddressLine2("Apt 101");
        when(addressRepository.findById(any(UUID.class))).thenReturn(Optional.of(testAddress));
        when(productService.getProductEntityById(any(UUID.class))).thenReturn(testProduct);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(orderId);
            return order;
        });

        // Act
        OrderResponseDto result = orderService.createOrder(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getDeliveryAddress().getAddress()).contains("Apt 101");
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void updateOrderStatus_WithDELIVEREDStatus_ShouldSetDeliveredAt() {
        // Arrange
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderResponseDto result = orderService.updateOrderStatus(orderId, "DELIVERED");

        // Assert
        assertThat(result).isNotNull();
        assertThat(testOrder.getDeliveredAt()).isNotNull();
        assertThat(testOrder.getStatus()).isEqualTo("DELIVERED");
        verify(orderRepository, times(1)).save(testOrder);
    }

    @Test
    void updateOrderStatus_WithNonDELIVEREDStatus_ShouldNotSetDeliveredAt() {
        // Arrange
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        // Act
        OrderResponseDto result = orderService.updateOrderStatus(orderId, "PROCESSING");

        // Assert
        assertThat(result).isNotNull();
        assertThat(testOrder.getDeliveredAt()).isNull();
        assertThat(testOrder.getStatus()).isEqualTo("PROCESSING");
        verify(orderRepository, times(1)).save(testOrder);
    }

    @Test
    void cancelOrder_WithDELIVEREDStatus_ShouldThrowException() {
        // Arrange
        testOrder.setStatus("DELIVERED");
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));

        // Act & Assert
        assertThatThrownBy(() -> orderService.cancelOrder(orderId))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot cancel order with status: DELIVERED");
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void cancelOrder_WithCANCELLEDStatus_ShouldThrowException() {
        // Arrange
        testOrder.setStatus("CANCELLED");
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));

        // Act & Assert
        assertThatThrownBy(() -> orderService.cancelOrder(orderId))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot cancel order with status: CANCELLED");
        verify(orderRepository, never()).save(any(Order.class));
    }
}

