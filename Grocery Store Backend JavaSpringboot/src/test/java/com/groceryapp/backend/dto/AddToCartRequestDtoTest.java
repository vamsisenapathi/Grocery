package com.groceryapp.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AddToCartRequestDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void whenAllFieldsValid_thenNoConstraintViolations() {
        AddToCartRequestDto dto = new AddToCartRequestDto(
            UUID.randomUUID(),
            UUID.randomUUID(),
            5
        );

        Set<ConstraintViolation<AddToCartRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenUserIdIsNull_thenConstraintViolation() {
        AddToCartRequestDto dto = new AddToCartRequestDto(
            null,
            UUID.randomUUID(),
            5
        );

        Set<ConstraintViolation<AddToCartRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("User ID cannot be null");
    }

    @Test
    void whenProductIdIsNull_thenConstraintViolation() {
        AddToCartRequestDto dto = new AddToCartRequestDto(
            UUID.randomUUID(),
            null,
            5
        );

        Set<ConstraintViolation<AddToCartRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Product ID cannot be null");
    }

    @Test
    void whenQuantityIsZero_thenConstraintViolation() {
        AddToCartRequestDto dto = new AddToCartRequestDto(
            UUID.randomUUID(),
            UUID.randomUUID(),
            0
        );

        Set<ConstraintViolation<AddToCartRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Quantity must be at least 1");
    }

    @Test
    void whenQuantityIsNegative_thenConstraintViolation() {
        AddToCartRequestDto dto = new AddToCartRequestDto(
            UUID.randomUUID(),
            UUID.randomUUID(),
            -5
        );

        Set<ConstraintViolation<AddToCartRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Quantity must be at least 1");
    }

    @Test
    void whenQuantityIsOne_thenNoConstraintViolation() {
        AddToCartRequestDto dto = new AddToCartRequestDto(
            UUID.randomUUID(),
            UUID.randomUUID(),
            1
        );

        Set<ConstraintViolation<AddToCartRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenMultipleFieldsInvalid_thenMultipleConstraintViolations() {
        AddToCartRequestDto dto = new AddToCartRequestDto(
            null,
            null,
            0
        );

        Set<ConstraintViolation<AddToCartRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(3); // userId null, productId null, quantity < 1
    }
}
