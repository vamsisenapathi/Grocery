package com.groceryapp.backend.controller;

import com.groceryapp.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * NEW Controller specifically for fetching all categories
 * This is separate from CategoryController to avoid conflicts
 */
@RestController
@RequestMapping("/api-categories")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CategoriesApiController {
    
    private final ProductService productService;
    
    /**
     * Get all unique category names from products
     * Accessible at: GET /api/v1/api-categories
     * 
     * @return List of all distinct category names
     */
    @GetMapping
    public ResponseEntity<List<String>> getAllCategories() {
        log.info("✅ Received request to get all categories via NEW API");
        List<String> categories = productService.getAllCategories();
        log.info("✅ Found {} unique categories", categories.size());
        return ResponseEntity.ok(categories);
    }
}
