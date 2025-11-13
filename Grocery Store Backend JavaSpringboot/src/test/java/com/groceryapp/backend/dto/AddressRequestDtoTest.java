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

class AddressRequestDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private AddressRequestDto.AddressRequestDtoBuilder createValidBuilder() {
        return AddressRequestDto.builder()
            .userId(UUID.randomUUID())
            .fullName("John Doe")
            .phoneNumber("9876543210")
            .addressLine1("123 Main Street")
            .city("Mumbai")
            .state("Maharashtra")
            .pincode("400001")
            .addressType("home")
            .isDefault(false);
    }

    @Test
    void whenAllRequiredFieldsValid_thenNoConstraintViolations() {
        AddressRequestDto dto = createValidBuilder()
            .addressLine2("Apartment 4B")
            .latitude(19.0760)
            .longitude(72.8777)
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenUserIdIsNull_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .userId(null)
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("User ID"));
    }

    @Test
    void whenFullNameIsBlank_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .fullName("")
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Full name"));
    }

    @Test
    void whenPhoneNumberIsBlank_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .phoneNumber("")
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Phone number"));
    }

    @Test
    void whenPhoneNumberHasInvalidFormat_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .phoneNumber("12345") // Only 5 digits
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("10 digits"));
    }

    @Test
    void whenPhoneNumberHasNonDigits_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .phoneNumber("98765abc10") // Contains letters
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("10 digits"));
    }

    @Test
    void whenAddressLine1IsBlank_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .addressLine1("")
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Address line 1"));
    }

    @Test
    void whenAddressLine2IsNull_thenNoConstraintViolation() {
        // AddressLine2 is optional
        AddressRequestDto dto = createValidBuilder()
            .addressLine2(null)
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenCityIsBlank_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .city("")
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("City"));
    }

    @Test
    void whenStateIsBlank_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .state("")
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("State"));
    }

    @Test
    void whenPincodeIsBlank_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .pincode("")
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Pincode"));
    }

    @Test
    void whenPincodeHasInvalidFormat_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .pincode("12345") // Only 5 digits
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("6 digits"));
    }

    @Test
    void whenPincodeHasNonDigits_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .pincode("40000A") // Contains letter
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("6 digits"));
    }

    @Test
    void whenAddressTypeIsBlank_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .addressType("")
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Address type"));
    }

    @Test
    void whenAddressTypeIsInvalid_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .addressType("invalid")
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("home") || v.getMessage().contains("work") || v.getMessage().contains("other"));
    }

    @Test
    void whenIsDefaultIsNull_thenConstraintViolation() {
        AddressRequestDto dto = createValidBuilder()
            .isDefault(null)
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSizeGreaterThanOrEqualTo(1);
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Default flag"));
    }

    @Test
    void whenLatitudeAndLongitudeAreNull_thenNoConstraintViolation() {
        // Latitude and longitude are optional
        AddressRequestDto dto = createValidBuilder()
            .latitude(null)
            .longitude(null)
            .build();

        Set<ConstraintViolation<AddressRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }
}
