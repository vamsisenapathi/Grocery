package com.groceryapp.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Product entity with complete Blinkit-style structure
 * Supports hierarchical categories, brands, inventory, ratings, and discounts
 */
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_name", columnList = "name"),
    @Index(name = "idx_product_category", columnList = "category_id"),
    @Index(name = "idx_product_subcategory", columnList = "subcategory_id"),
    @Index(name = "idx_product_brand", columnList = "brand_id"),
    @Index(name = "idx_product_available", columnList = "is_available"),
    @Index(name = "idx_product_featured", columnList = "is_featured"),
    @Index(name = "idx_product_price", columnList = "price"),
    @Index(name = "idx_product_rating", columnList = "rating")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @NotBlank(message = "Product name cannot be blank")
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be positive")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "mrp", precision = 10, scale = 2)
    private BigDecimal mrp;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false, foreignKey = @ForeignKey(name = "fk_product_category"))
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategory_id", foreignKey = @ForeignKey(name = "fk_product_subcategory"))
    private Subcategory subcategory;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", foreignKey = @ForeignKey(name = "fk_product_brand"))
    private Brand brand;
    
    @Min(value = 0, message = "Stock cannot be negative")
    @Column(name = "stock", nullable = false)
    private Integer stock = 0;
    
    @Column(name = "unit")
    private String unit; // kg, g, l, ml, pcs, etc.
    
    @Column(name = "quantity_per_unit", precision = 10, scale = 2)
    private BigDecimal quantityPerUnit; // 1, 0.5, 250, etc.
    
    @Column(name = "weight_quantity")
    private String weightQuantity; // "500 g", "1 kg", "1 L", etc.
    
    @Min(value = 0, message = "Discount percentage cannot be negative")
    @Max(value = 100, message = "Discount percentage cannot exceed 100")
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage = BigDecimal.ZERO;
    
    @Min(value = 0, message = "Rating cannot be negative")
    @Max(value = 5, message = "Rating cannot exceed 5")
    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;
    
    @Min(value = 0, message = "Review count cannot be negative")
    @Column(name = "review_count")
    private Integer reviewCount = 0;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(name = "image_urls", columnDefinition = "TEXT[]")
    private String[] imageUrls;
    
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;
    
    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;
    
    @Column(name = "is_trending", nullable = false)
    private Boolean isTrending = false;
    
    @Column(name = "is_new_arrival", nullable = false)
    private Boolean isNewArrival = false;
    
    @Column(name = "tags", columnDefinition = "TEXT[]")
    private String[] tags;
    
    @Column(name = "min_order_quantity")
    private Integer minOrderQuantity = 1;
    
    @Column(name = "max_order_quantity")
    private Integer maxOrderQuantity;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}