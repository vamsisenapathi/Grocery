package com.groceryapp.backend.controller;

import com.groceryapp.backend.dto.ProductResponseDto;
import com.groceryapp.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    private List<String> categories;
    private List<ProductResponseDto> products;

    @BeforeEach
    void setUp() {
        categories = Arrays.asList("Electronics", "Groceries", "Home Appliances");

        ProductResponseDto product = new ProductResponseDto();
        product.setId(UUID.randomUUID());
        product.setName("Laptop");
        product.setCategoryName("Electronics");
        product.setPrice(new BigDecimal("999.99"));

        products = Arrays.asList(product);
    }

    @Test
    void getAllCategories_ShouldReturnAllCategories() throws Exception {
        when(productService.getAllCategories()).thenReturn(categories);

        mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("Electronics"))
                .andExpect(jsonPath("$[1]").value("Groceries"))
                .andExpect(jsonPath("$[2]").value("Home Appliances"));

        verify(productService, times(1)).getAllCategories();
    }

    @Test
    void getProductsByCategoryName_WithValidCategory_ShouldReturnProducts() throws Exception {
        when(productService.getProductsByCategoryName("Electronics")).thenReturn(products);

        mockMvc.perform(get("/categories/{categoryName}", "Electronics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryName").value("Electronics"));

        verify(productService, times(1)).getProductsByCategoryName("Electronics");
    }

    @Test
    void getProductsByCategoryName_WithKebabCase_ShouldReturnProducts() throws Exception {
        when(productService.getProductsByCategoryName("home-appliances")).thenReturn(products);

        mockMvc.perform(get("/categories/{categoryName}", "home-appliances"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        verify(productService, times(1)).getProductsByCategoryName("home-appliances");
    }
}
