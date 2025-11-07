package com.groceryapp.backend.repository;

import com.groceryapp.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    List<Product> findByCategoryId(UUID categoryId);
    
    List<Product> findBySubcategoryId(UUID subcategoryId);
    
    List<Product> findByBrandId(UUID brandId);
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByIsAvailableTrue();
    
    List<Product> findByIsFeaturedTrue();
    
    List<Product> findByIsTrendingTrue();
    
    @Query("SELECT p FROM Product p WHERE p.stock > 0 AND p.isAvailable = true")
    List<Product> findInStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.stock > 0 AND p.isAvailable = true")
    List<Product> findInStockProductsByCategory(@Param("categoryId") UUID categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.subcategory.id = :subcategoryId AND p.stock > 0 AND p.isAvailable = true")
    List<Product> findInStockProductsBySubcategory(@Param("subcategoryId") UUID subcategoryId);
    
    // Enhanced search: matches product name, description, AND category name
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.category.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> searchByNameDescriptionOrCategory(@Param("searchTerm") String searchTerm);
    
    // Find products by category name (case-insensitive)
    @Query("SELECT p FROM Product p WHERE LOWER(p.category.name) = LOWER(:categoryName)")
    List<Product> findByCategoryName(@Param("categoryName") String categoryName);
}
