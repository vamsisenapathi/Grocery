package com.groceryapp.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDto {
    
    @NotBlank(message = "Product name cannot be blank")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private BigDecimal mrp;
    
    @NotNull(message = "Category ID cannot be null")
    private UUID categoryId;
    
    private UUID subcategoryId;
    
    private UUID brandId;
    
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
    
    private String unit;
    
    private BigDecimal quantityPerUnit;
    
    private String weightQuantity;
    
    @Min(value = 0, message = "Discount percentage cannot be negative")
    @Max(value = 100, message = "Discount percentage cannot exceed 100")
    private BigDecimal discountPercentage;
    
    private String imageUrl;
    
    private String[] imageUrls;
    
    private Boolean isAvailable;
    
    private Boolean isFeatured;
    
    private String[] tags;
    
    private Integer minOrderQuantity;
    
    private Integer maxOrderQuantity;
}
