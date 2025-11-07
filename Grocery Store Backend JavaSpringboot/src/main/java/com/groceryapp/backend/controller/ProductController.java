package com.groceryapp.backend.controller;

import com.groceryapp.backend.dto.ProductRequestDto;
import com.groceryapp.backend.dto.ProductResponseDto;
import com.groceryapp.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ProductController {
    
    private final ProductService productService;
    
    @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductRequestDto requestDto) {
        log.info("Received request to create product: {}", requestDto.getName());
        ProductResponseDto product = productService.createProduct(requestDto);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAllProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID subcategoryId,
            @RequestParam(required = false) String search) {
        
        log.info("Received request to get all products. CategoryId: {}, SubcategoryId: {}, Search: {}", categoryId, subcategoryId, search);
        
        List<ProductResponseDto> products;
        
        if (search != null && !search.trim().isEmpty()) {
            products = productService.searchProducts(search.trim());
        } else if (subcategoryId != null) {
            products = productService.getProductsBySubcategory(subcategoryId);
        } else if (categoryId != null) {
            products = productService.getProductsByCategory(categoryId);
        } else {
            products = productService.getAllProducts();
        }
        
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponseDto>> getFeaturedProducts() {
        log.info("Received request to get featured products");
        List<ProductResponseDto> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable UUID id) {
        log.info("Received request to get product with ID: {}", id);
        ProductResponseDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable UUID id, 
            @Valid @RequestBody ProductRequestDto requestDto) {
        
        log.info("Received request to update product with ID: {}", id);
        ProductResponseDto product = productService.updateProduct(id, requestDto);
        return ResponseEntity.ok(product);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        log.info("Received request to delete product with ID: {}", id);
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}