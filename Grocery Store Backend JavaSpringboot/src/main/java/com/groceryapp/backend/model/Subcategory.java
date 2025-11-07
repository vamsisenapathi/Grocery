package com.groceryapp.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Subcategory entity for hierarchical category structure
 * Examples: Fruits → Seasonal Fruits, Fresh Fruits
 */
@Entity
@Table(name = "subcategories", indexes = {
    @Index(name = "idx_subcategory_name", columnList = "name"),
    @Index(name = "idx_subcategory_category", columnList = "category_id"),
    @Index(name = "idx_subcategory_active", columnList = "is_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subcategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @NotBlank(message = "Subcategory name cannot be blank")
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(name = "display_order")
    private Integer displayOrder;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false, foreignKey = @ForeignKey(name = "fk_subcategory_category"))
    private Category category;
    
    @OneToMany(mappedBy = "subcategory", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
