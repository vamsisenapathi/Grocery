package com.groceryapp.backend.controller;

import com.groceryapp.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class CategoriesApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    private List<String> categories;

    @BeforeEach
    void setUp() {
        categories = Arrays.asList("Fruits", "Vegetables", "Dairy", "Snacks");
    }

    @Test
    void getAllCategories_ShouldReturnCategoriesList() throws Exception {
        when(productService.getAllCategories()).thenReturn(categories);

        mockMvc.perform(get("/api-categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0]").value("Fruits"))
                .andExpect(jsonPath("$[1]").value("Vegetables"))
                .andExpect(jsonPath("$[2]").value("Dairy"))
                .andExpect(jsonPath("$[3]").value("Snacks"));

        verify(productService, times(1)).getAllCategories();
    }

    @Test
    void getAllCategories_WithEmptyList_ShouldReturnEmptyArray() throws Exception {
        when(productService.getAllCategories()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api-categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        verify(productService, times(1)).getAllCategories();
    }

    @Test
    void getAllCategories_WithSingleCategory_ShouldReturnSingleElement() throws Exception {
        when(productService.getAllCategories()).thenReturn(Collections.singletonList("Fruits"));

        mockMvc.perform(get("/api-categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0]").value("Fruits"));

        verify(productService, times(1)).getAllCategories();
    }
}
