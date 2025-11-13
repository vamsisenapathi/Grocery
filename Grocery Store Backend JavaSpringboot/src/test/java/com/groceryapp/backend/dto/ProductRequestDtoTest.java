package com.groceryapp.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class ProductRequestDtoTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void whenAllRequiredFieldsValid_thenNoConstraintViolations() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setDescription("Test Description");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());
        dto.setStock(100);
        dto.setDiscountPercentage(new BigDecimal("10"));

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenNameIsBlank_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Product name cannot be blank");
    }

    @Test
    void whenNameIsNull_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName(null);
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
    }

    @Test
    void whenPriceIsNull_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(null);
        dto.setCategoryId(UUID.randomUUID());

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Price cannot be null");
    }

    @Test
    void whenPriceIsZero_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(BigDecimal.ZERO);
        dto.setCategoryId(UUID.randomUUID());

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Price must be positive");
    }

    @Test
    void whenPriceIsNegative_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(new BigDecimal("-10.00"));
        dto.setCategoryId(UUID.randomUUID());

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Price must be positive");
    }

    @Test
    void whenCategoryIdIsNull_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(null);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Category ID cannot be null");
    }

    @Test
    void whenStockIsNegative_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());
        dto.setStock(-10);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Stock cannot be negative");
    }

    @Test
    void whenStockIsZero_thenNoConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());
        dto.setStock(0);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenDiscountPercentageIsNegative_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());
        dto.setDiscountPercentage(new BigDecimal("-5"));

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Discount percentage cannot be negative");
    }

    @Test
    void whenDiscountPercentageExceeds100_thenConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());
        dto.setDiscountPercentage(new BigDecimal("150"));

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).contains("Discount percentage cannot exceed 100");
    }

    @Test
    void whenDiscountPercentageIs100_thenNoConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());
        dto.setDiscountPercentage(new BigDecimal("100"));

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenOptionalFieldsAreNull_thenNoConstraintViolation() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Test Product");
        dto.setPrice(new BigDecimal("99.99"));
        dto.setCategoryId(UUID.randomUUID());
        dto.setDescription(null);
        dto.setMrp(null);
        dto.setSubcategoryId(null);
        dto.setBrandId(null);
        dto.setUnit(null);
        dto.setQuantityPerUnit(null);
        dto.setWeightQuantity(null);
        dto.setDiscountPercentage(null);
        dto.setImageUrl(null);

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).isEmpty();
    }

    @Test
    void whenMultipleFieldsInvalid_thenMultipleConstraintViolations() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("");
        dto.setPrice(new BigDecimal("-10"));
        dto.setCategoryId(null);
        dto.setStock(-5);
        dto.setDiscountPercentage(new BigDecimal("150"));

        Set<ConstraintViolation<ProductRequestDto>> violations = validator.validate(dto);

        assertThat(violations).hasSize(5); // name blank, price negative, category null, stock negative, discount > 100
    }
}
