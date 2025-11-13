package com.groceryapp.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class RegisterRequestDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void whenAllFieldsValid_thenNoConstraintViolations() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "John Doe",
            "john.doe@example.com",
            "password123",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenNameIsBlank_thenConstraintViolation() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "",
            "john.doe@example.com",
            "password123",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Name"));
    }

    @Test
    void whenNameIsTooShort_thenConstraintViolation() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "J",
            "john.doe@example.com",
            "password123",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Name must be between 2 and 100 characters");
    }

    @Test
    void whenNameIsTooLong_thenConstraintViolation() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "A".repeat(101),
            "john.doe@example.com",
            "password123",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Name must be between 2 and 100 characters");
    }

    @Test
    void whenEmailIsBlank_thenConstraintViolation() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "John Doe",
            "",
            "password123",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Email is required");
    }

    @Test
    void whenEmailIsInvalid_thenConstraintViolation() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "John Doe",
            "invalid-email",
            "password123",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Email must be valid");
    }

    @Test
    void whenPasswordIsBlank_thenConstraintViolation() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "John Doe",
            "john.doe@example.com",
            "",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Password"));
    }

    @Test
    void whenPasswordIsTooShort_thenConstraintViolation() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "John Doe",
            "john.doe@example.com",
            "pass123",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Password must be between 8 and 13 characters");
    }

    @Test
    void whenPasswordIsTooLong_thenConstraintViolation() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "John Doe",
            "john.doe@example.com",
            "password123456",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Password must be between 8 and 13 characters");
    }

    @Test
    void whenPhoneNumberIsNull_thenNoConstraintViolation() {
        // Phone number is optional, so null should be valid
        RegisterRequestDto dto = new RegisterRequestDto(
            "John Doe",
            "john.doe@example.com",
            "password123",
            null
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenMultipleFieldsInvalid_thenMultipleConstraintViolations() {
        RegisterRequestDto dto = new RegisterRequestDto(
            "",
            "invalid-email",
            "short",
            "1234567890"
        );

        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(3); // name blank + size, email invalid, password too short
    }
}
