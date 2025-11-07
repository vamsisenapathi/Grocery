package com.groceryapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {
    
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal mrp;
    
    // Category information
    private UUID categoryId;
    private String categoryName;
    
    // Subcategory information
    private UUID subcategoryId;
    private String subcategoryName;
    
    // Brand information
    private UUID brandId;
    private String brandName;
    
    private Integer stock;
    private String unit;
    private BigDecimal quantityPerUnit;
    private String weightQuantity;
    private BigDecimal discountPercentage;
    private BigDecimal rating;
    private Integer reviewCount;
    
    private String imageUrl;
    private String[] imageUrls;
    
    private Boolean isAvailable;
    private Boolean isFeatured;
    private Boolean isTrending;
    private Boolean isNewArrival;
    
    private String[] tags;
    private Integer minOrderQuantity;
    private Integer maxOrderQuantity;
    
    private Instant createdAt;
    private Instant updatedAt;
}
