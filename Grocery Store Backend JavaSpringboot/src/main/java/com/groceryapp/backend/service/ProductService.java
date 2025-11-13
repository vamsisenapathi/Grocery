package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.ProductRequestDto;
import com.groceryapp.backend.dto.ProductResponseDto;
import com.groceryapp.backend.exception.ProductNotFoundException;
import com.groceryapp.backend.model.Brand;
import com.groceryapp.backend.model.Category;
import com.groceryapp.backend.model.Product;
import com.groceryapp.backend.model.Subcategory;
import com.groceryapp.backend.repository.BrandRepository;
import com.groceryapp.backend.repository.CategoryRepository;
import com.groceryapp.backend.repository.ProductRepository;
import com.groceryapp.backend.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final BrandRepository brandRepository;
    
    public ProductResponseDto createProduct(ProductRequestDto requestDto) {
        log.info("Creating new product: {}", requestDto.getName());
        
        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + requestDto.getCategoryId()));
        
        Subcategory subcategory = null;
        if (requestDto.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(requestDto.getSubcategoryId())
                    .orElseThrow(() -> new RuntimeException("Subcategory not found with ID: " + requestDto.getSubcategoryId()));
        }
        
        Brand brand = null;
        if (requestDto.getBrandId() != null) {
            brand = brandRepository.findById(requestDto.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + requestDto.getBrandId()));
        }
        
        Product product = new Product();
        product.setName(requestDto.getName());
        product.setDescription(requestDto.getDescription());
        product.setPrice(requestDto.getPrice());
        product.setMrp(requestDto.getMrp() != null ? requestDto.getMrp() : requestDto.getPrice());
        product.setCategory(category);
        product.setSubcategory(subcategory);
        product.setBrand(brand);
        product.setStock(requestDto.getStock() != null ? requestDto.getStock() : 0);
        product.setUnit(requestDto.getUnit());
        product.setQuantityPerUnit(requestDto.getQuantityPerUnit());
        product.setWeightQuantity(requestDto.getWeightQuantity());
        product.setDiscountPercentage(requestDto.getDiscountPercentage() != null ? requestDto.getDiscountPercentage() : BigDecimal.ZERO);
        product.setImageUrl(requestDto.getImageUrl());
        product.setImageUrls(requestDto.getImageUrls());
        product.setIsAvailable(requestDto.getIsAvailable() != null ? requestDto.getIsAvailable() : true);
        product.setIsFeatured(requestDto.getIsFeatured() != null ? requestDto.getIsFeatured() : false);
        product.setTags(requestDto.getTags());
        product.setMinOrderQuantity(requestDto.getMinOrderQuantity() != null ? requestDto.getMinOrderQuantity() : 1);
        product.setMaxOrderQuantity(requestDto.getMaxOrderQuantity());
        
        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with ID: {}", savedProduct.getId());
        
        return mapToResponseDto(savedProduct);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts() {
        log.info("Fetching all products");
        
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        log.info("Fetching all unique categories");
        
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> product.getCategory().getName())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(@NonNull UUID productId) {
        log.info("Fetching product with ID: {}", productId);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        
        return mapToResponseDto(product);
    }
    
    public ProductResponseDto updateProduct(@NonNull UUID productId, ProductRequestDto requestDto) {
        log.info("Updating product with ID: {}", productId);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        
        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + requestDto.getCategoryId()));
        
        Subcategory subcategory = null;
        if (requestDto.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(requestDto.getSubcategoryId())
                    .orElseThrow(() -> new RuntimeException("Subcategory not found with ID: " + requestDto.getSubcategoryId()));
        }
        
        Brand brand = null;
        if (requestDto.getBrandId() != null) {
            brand = brandRepository.findById(requestDto.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found with ID: " + requestDto.getBrandId()));
        }
        
        product.setName(requestDto.getName());
        product.setDescription(requestDto.getDescription());
        product.setPrice(requestDto.getPrice());
        product.setMrp(requestDto.getMrp() != null ? requestDto.getMrp() : requestDto.getPrice());
        product.setCategory(category);
        product.setSubcategory(subcategory);
        product.setBrand(brand);
        product.setStock(requestDto.getStock() != null ? requestDto.getStock() : 0);
        product.setUnit(requestDto.getUnit());
        product.setQuantityPerUnit(requestDto.getQuantityPerUnit());
        product.setWeightQuantity(requestDto.getWeightQuantity());
        product.setDiscountPercentage(requestDto.getDiscountPercentage() != null ? requestDto.getDiscountPercentage() : BigDecimal.ZERO);
        product.setImageUrl(requestDto.getImageUrl());
        product.setImageUrls(requestDto.getImageUrls());
        product.setIsAvailable(requestDto.getIsAvailable() != null ? requestDto.getIsAvailable() : true);
        product.setIsFeatured(requestDto.getIsFeatured() != null ? requestDto.getIsFeatured() : false);
        product.setTags(requestDto.getTags());
        product.setMinOrderQuantity(requestDto.getMinOrderQuantity() != null ? requestDto.getMinOrderQuantity() : 1);
        product.setMaxOrderQuantity(requestDto.getMaxOrderQuantity());
        product.setUpdatedAt(Instant.now());
        
        Product updatedProduct = productRepository.save(product);
        log.info("Product updated successfully with ID: {}", updatedProduct.getId());
        
        return mapToResponseDto(updatedProduct);
    }
    
    public void deleteProduct(@NonNull UUID productId) {
        log.info("Deleting product with ID: {}", productId);
        
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException(productId);
        }
        
        productRepository.deleteById(productId);
        log.info("Product deleted successfully with ID: {}", productId);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getProductsByCategory(UUID categoryId) {
        log.info("Fetching products by category ID: {}", categoryId);
        
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return products.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getProductsBySubcategory(UUID subcategoryId) {
        log.info("Fetching products by subcategory ID: {}", subcategoryId);
        
        List<Product> products = productRepository.findBySubcategoryId(subcategoryId);
        return products.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDto> searchProducts(String searchTerm) {
        log.info("Searching products with term: {}", searchTerm);
        
        if (searchTerm == null || searchTerm.trim().length() < 2) {
            log.warn("Search term too short (minimum 2 characters required): {}", searchTerm);
            return List.of();
        }
        
        List<Product> products = productRepository.searchByNameDescriptionOrCategory(searchTerm.trim());
        return products.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getProductsByCategoryName(String categoryName) {
        log.info("Fetching products by category name: {}", categoryName);
        
        String titleCaseName = convertKebabCaseToTitleCase(categoryName);
        log.info("Converted category name to: {}", titleCaseName);
        
        List<Product> products = productRepository.findByCategoryName(titleCaseName);
        return products.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    private String convertKebabCaseToTitleCase(String kebabCase) {
        if (kebabCase == null || kebabCase.trim().isEmpty()) {
            return kebabCase;
        }
        
        String[] words = kebabCase.split("-");
        StringBuilder titleCase = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            String word = words[i].trim();
            if (!word.isEmpty()) {
                titleCase.append(Character.toUpperCase(word.charAt(0)));
                if (word.length() > 1) {
                    titleCase.append(word.substring(1).toLowerCase());
                }
                
                if (i < words.length - 1) {
                    titleCase.append(" ");
                }
            }
        }
        
        return titleCase.toString();
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getFeaturedProducts() {
        log.info("Fetching featured products");
        
        List<Product> products = productRepository.findByIsFeaturedTrue();
        return products.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Product getProductEntityById(@NonNull UUID productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
    }
    
    @Transactional
    public void updateProductStock(Product product) {
        log.info("Updating stock for product: {}", product.getId());
        productRepository.save(product);
    }
    
    private ProductResponseDto mapToResponseDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setMrp(product.getMrp());
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        
        if (product.getSubcategory() != null) {
            dto.setSubcategoryId(product.getSubcategory().getId());
            dto.setSubcategoryName(product.getSubcategory().getName());
        }
        
        if (product.getBrand() != null) {
            dto.setBrandId(product.getBrand().getId());
            dto.setBrandName(product.getBrand().getName());
        }
        
        dto.setStock(product.getStock());
        dto.setUnit(product.getUnit());
        dto.setQuantityPerUnit(product.getQuantityPerUnit());
        dto.setWeightQuantity(product.getWeightQuantity());
        dto.setDiscountPercentage(product.getDiscountPercentage());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setImageUrl(product.getImageUrl());
        dto.setImageUrls(product.getImageUrls());
        dto.setIsAvailable(product.getIsAvailable());
        dto.setIsFeatured(product.getIsFeatured());
        dto.setIsTrending(product.getIsTrending());
        dto.setIsNewArrival(product.getIsNewArrival());
        dto.setTags(product.getTags());
        dto.setMinOrderQuantity(product.getMinOrderQuantity());
        dto.setMaxOrderQuantity(product.getMaxOrderQuantity());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        return dto;
    }
    
    /**
     * Decrease product stock (when adding to cart or placing order)
     * @param productId The product ID
     * @param quantity The quantity to decrease
     * @throws ProductNotFoundException if product not found
     * @throws RuntimeException if insufficient stock
     */
    @Transactional
    public void decreaseStock(UUID productId, int quantity) {
        log.info("Decreasing stock for product: {} by quantity: {}", productId, quantity);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        
        if (product.getStock() < quantity) {
            throw new RuntimeException(String.format(
                "Insufficient stock for product: %s. Available: %d, Requested: %d",
                product.getName(), product.getStock(), quantity
            ));
        }
        
        product.setStock(product.getStock() - quantity);
        
        // Update availability if stock becomes zero
        if (product.getStock() == 0) {
            product.setIsAvailable(false);
            log.info("Product {} is now out of stock", product.getName());
        }
        
        productRepository.save(product);
        log.info("Stock decreased successfully. New stock: {}", product.getStock());
    }
    
    /**
     * Increase product stock (when removing from cart or cancelling order)
     * @param productId The product ID
     * @param quantity The quantity to increase
     * @throws ProductNotFoundException if product not found
     */
    @Transactional
    public void increaseStock(UUID productId, int quantity) {
        log.info("Increasing stock for product: {} by quantity: {}", productId, quantity);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        
        product.setStock(product.getStock() + quantity);
        
        // Make product available again if it was out of stock
        if (!product.getIsAvailable() && product.getStock() > 0) {
            product.setIsAvailable(true);
            log.info("Product {} is now back in stock", product.getName());
        }
        
        productRepository.save(product);
        log.info("Stock increased successfully. New stock: {}", product.getStock());
    }
}
