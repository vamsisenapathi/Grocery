package com.groceryapp.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class LoginRequestDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void whenAllFieldsValid_thenNoConstraintViolations() {
        LoginRequestDto dto = new LoginRequestDto(
            "john.doe@example.com",
            "password123"
        );

        Set<ConstraintViolation<LoginRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenEmailIsBlank_thenConstraintViolation() {
        LoginRequestDto dto = new LoginRequestDto(
            "",
            "password123"
        );

        Set<ConstraintViolation<LoginRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Email is required");
    }

    @Test
    void whenEmailIsNull_thenConstraintViolation() {
        LoginRequestDto dto = new LoginRequestDto(
            null,
            "password123"
        );

        Set<ConstraintViolation<LoginRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
    }

    @Test
    void whenEmailIsInvalid_thenConstraintViolation() {
        LoginRequestDto dto = new LoginRequestDto(
            "not-an-email",
            "password123"
        );

        Set<ConstraintViolation<LoginRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Email must be valid");
    }

    @Test
    void whenPasswordIsBlank_thenConstraintViolation() {
        LoginRequestDto dto = new LoginRequestDto(
            "john.doe@example.com",
            ""
        );

        Set<ConstraintViolation<LoginRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Password is required");
    }

    @Test
    void whenPasswordIsNull_thenConstraintViolation() {
        LoginRequestDto dto = new LoginRequestDto(
            "john.doe@example.com",
            null
        );

        Set<ConstraintViolation<LoginRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
    }

    @Test
    void whenBothFieldsInvalid_thenMultipleConstraintViolations() {
        LoginRequestDto dto = new LoginRequestDto(
            "invalid-email",
            ""
        );

        Set<ConstraintViolation<LoginRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(2); // email invalid, password blank
    }
}
