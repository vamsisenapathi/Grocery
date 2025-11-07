package com.groceryapp.backend.controller;

import com.groceryapp.backend.dto.ProductResponseDto;
import com.groceryapp.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for category-based product retrieval
 * Supports kebab-case category names in URL paths
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private final ProductService productService;
    
    /**
     * Get products by category name (supports kebab-case URLs)
     * 
     * Examples:
     * - GET /categories/home-appliances -> matches 'Home Appliances'
     * - GET /categories/cold-drinks -> matches 'Cold Drinks'
     * - GET /categories/electronics -> matches 'Electronics'
     * 
     * @param categoryName Category name in kebab-case or plain text
     * @return List of products in the specified category
     */
    @GetMapping("/{categoryName}")
    public ResponseEntity<List<ProductResponseDto>> getProductsByCategoryName(
            @PathVariable String categoryName) {
        
        log.info("Received request to get products by category name: {}", categoryName);
        
        List<ProductResponseDto> products = productService.getProductsByCategoryName(categoryName);
        
        log.info("Found {} products for category: {}", products.size(), categoryName);
        return ResponseEntity.ok(products);
    }
}
