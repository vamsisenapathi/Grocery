package com.groceryapp.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groceryapp.backend.dto.ProductRequestDto;
import com.groceryapp.backend.dto.ProductResponseDto;
import com.groceryapp.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private ProductRequestDto productRequest;
    private ProductResponseDto productResponse;
    private UUID productId;
    private UUID categoryId;
    private UUID subcategoryId;

    @BeforeEach
    void setUp() {
        productId = UUID.randomUUID();
        categoryId = UUID.randomUUID();
        subcategoryId = UUID.randomUUID();

        productRequest = new ProductRequestDto();
        productRequest.setName("Apple");
        productRequest.setDescription("Fresh red apple");
        productRequest.setPrice(new BigDecimal("2.99"));
        productRequest.setMrp(new BigDecimal("3.99"));
        productRequest.setCategoryId(categoryId);
        productRequest.setSubcategoryId(subcategoryId);
        productRequest.setImageUrl("http://example.com/apple.jpg");
        productRequest.setIsFeatured(true);

        productResponse = new ProductResponseDto();
        productResponse.setId(productId);
        productResponse.setName("Apple");
        productResponse.setDescription("Fresh red apple");
        productResponse.setPrice(new BigDecimal("2.99"));
        productResponse.setMrp(new BigDecimal("3.99"));
        productResponse.setCategoryName("Fruits");
        productResponse.setSubcategoryName("Fresh Fruits");
        productResponse.setImageUrl("http://example.com/apple.jpg");
        productResponse.setIsFeatured(true);
    }

    @Test
    void createProduct_WithValidData_ShouldReturnCreated() throws Exception {
        when(productService.createProduct(any(ProductRequestDto.class))).thenReturn(productResponse);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Apple"))
                .andExpect(jsonPath("$.price").value(2.99));

        verify(productService, times(1)).createProduct(any(ProductRequestDto.class));
    }

    @Test
    void getAllProducts_WithoutFilters_ShouldReturnAllProducts() throws Exception {
        List<ProductResponseDto> products = Arrays.asList(productResponse);
        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Apple"));

        verify(productService, times(1)).getAllProducts();
    }

    @Test
    void getAllProducts_WithCategoryFilter_ShouldReturnFilteredProducts() throws Exception {
        List<ProductResponseDto> products = Arrays.asList(productResponse);
        when(productService.getProductsByCategory(categoryId)).thenReturn(products);

        mockMvc.perform(get("/products")
                        .param("categoryId", categoryId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Apple"));

        verify(productService, times(1)).getProductsByCategory(categoryId);
    }

    @Test
    void getAllProducts_WithSubcategoryFilter_ShouldReturnFilteredProducts() throws Exception {
        List<ProductResponseDto> products = Arrays.asList(productResponse);
        when(productService.getProductsBySubcategory(subcategoryId)).thenReturn(products);

        mockMvc.perform(get("/products")
                        .param("subcategoryId", subcategoryId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Apple"));

        verify(productService, times(1)).getProductsBySubcategory(subcategoryId);
    }

    @Test
    void getAllProducts_WithSearchQuery_ShouldReturnSearchResults() throws Exception {
        List<ProductResponseDto> products = Arrays.asList(productResponse);
        when(productService.searchProducts("apple")).thenReturn(products);

        mockMvc.perform(get("/products")
                        .param("search", "apple"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Apple"));

        verify(productService, times(1)).searchProducts("apple");
    }

    @Test
    void getFeaturedProducts_ShouldReturnFeaturedProducts() throws Exception {
        List<ProductResponseDto> products = Arrays.asList(productResponse);
        when(productService.getFeaturedProducts()).thenReturn(products);

        mockMvc.perform(get("/products/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].isFeatured").value(true));

        verify(productService, times(1)).getFeaturedProducts();
    }

    @Test
    void searchProducts_WithQuery_ShouldReturnSearchResults() throws Exception {
        List<ProductResponseDto> products = Arrays.asList(productResponse);
        when(productService.searchProducts("apple")).thenReturn(products);

        mockMvc.perform(get("/products/search")
                        .param("query", "apple"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Apple"));

        verify(productService, times(1)).searchProducts("apple");
    }

    @Test
    void getProductById_WithValidId_ShouldReturnProduct() throws Exception {
        when(productService.getProductById(productId)).thenReturn(productResponse);

        mockMvc.perform(get("/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId.toString()))
                .andExpect(jsonPath("$.name").value("Apple"));

        verify(productService, times(1)).getProductById(productId);
    }

    @Test
    void updateProduct_WithValidData_ShouldReturnUpdatedProduct() throws Exception {
        when(productService.updateProduct(eq(productId), any(ProductRequestDto.class))).thenReturn(productResponse);

        mockMvc.perform(put("/products/{id}", productId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Apple"));

        verify(productService, times(1)).updateProduct(eq(productId), any(ProductRequestDto.class));
    }

    @Test
    void deleteProduct_WithValidId_ShouldReturnNoContent() throws Exception {
        doNothing().when(productService).deleteProduct(productId);

        mockMvc.perform(delete("/products/{id}", productId))
                .andExpect(status().isNoContent());

        verify(productService, times(1)).deleteProduct(productId);
    }

    // ========== BRANCH COVERAGE TEST ==========

    @Test
    void getAllProducts_WithEmptySearchQuery_ShouldReturnAllProducts() throws Exception {
        // Tests: search != null && !search.trim().isEmpty() → FALSE branch
        // When search is empty/whitespace, should call getAllProducts() not searchProducts()
        List<ProductResponseDto> products = Arrays.asList(productResponse);
        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/products")
                        .param("search", "   "))  // Whitespace only
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Apple"));

        verify(productService, times(1)).getAllProducts();
        verify(productService, never()).searchProducts(anyString());
    }
}
