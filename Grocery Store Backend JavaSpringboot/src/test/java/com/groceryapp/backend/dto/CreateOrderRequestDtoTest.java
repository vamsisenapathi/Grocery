package com.groceryapp.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class CreateOrderRequestDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void whenAllFieldsValid_thenNoConstraintViolations() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            Collections.singletonList(item),
            "COD",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenUserIdIsNull_thenConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            null,
            Collections.singletonList(item),
            "COD",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("User ID cannot be null");
    }

    @Test
    void whenItemsIsNull_thenConstraintViolation() {
        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            null,
            "COD",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Cart items cannot be null");
    }

    @Test
    void whenPaymentMethodIsBlank_thenConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            Collections.singletonList(item),
            "",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Payment method"));
    }

    @Test
    void whenPaymentMethodIsInvalid_thenConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            Collections.singletonList(item),
            "INVALID_PAYMENT",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Payment method must be");
    }

    @Test
    void whenPaymentMethodIsCOD_thenNoConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            Collections.singletonList(item),
            "COD",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenPaymentMethodIsCard_thenNoConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            Collections.singletonList(item),
            "CARD",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenPaymentMethodIsUPI_thenNoConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            Collections.singletonList(item),
            "UPI",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenPaymentMethodIsLowerCase_thenNoConstraintViolation() {
        // Pattern is case-insensitive
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            Collections.singletonList(item),
            "cod",
            UUID.randomUUID()
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenDeliveryAddressIdIsNull_thenConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            5
        );

        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            UUID.randomUUID(),
            Collections.singletonList(item),
            "COD",
            null
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Delivery address ID is required");
    }

    @Test
    void whenMultipleFieldsInvalid_thenMultipleConstraintViolations() {
        CreateOrderRequestDto dto = new CreateOrderRequestDto(
            null,
            null,
            "",
            null
        );

        Set<ConstraintViolation<CreateOrderRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(4); // userId, items, paymentMethod, deliveryAddressId
    }

    // Nested OrderItemDto tests
    @Test
    void whenOrderItemProductIdIsNull_thenConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            null,
            5
        );

        Set<ConstraintViolation<CreateOrderRequestDto.OrderItemDto>> violations = validator.validate(item);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Product ID cannot be null");
    }

    @Test
    void whenOrderItemQuantityIsNull_thenConstraintViolation() {
        CreateOrderRequestDto.OrderItemDto item = new CreateOrderRequestDto.OrderItemDto(
            UUID.randomUUID(),
            null
        );

        Set<ConstraintViolation<CreateOrderRequestDto.OrderItemDto>> violations = validator.validate(item);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Quantity cannot be null");
    }
}
