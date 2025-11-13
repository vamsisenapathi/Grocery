package com.groceryapp.backend.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class ProductTest {

    @Test
    void testProductCreation() {
        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setName("Laptop");
        product.setPrice(BigDecimal.valueOf(999.99));
        product.setMrp(BigDecimal.valueOf(1200.00));

        assertThat(product.getId()).isNotNull();
        assertThat(product.getName()).isEqualTo("Laptop");
        assertThat(product.getPrice()).isEqualByComparingTo("999.99");
        assertThat(product.getMrp()).isEqualByComparingTo("1200.00");
    }

    @Test
    void testProductWithCategory() {
        Category category = new Category();
        category.setId(UUID.randomUUID());
        category.setName("Electronics");

        Product product = new Product();
        product.setCategory(category);

        assertThat(product.getCategory()).isEqualTo(category);
        assertThat(product.getCategory().getName()).isEqualTo("Electronics");
    }

    @Test
    void testProductWithSubcategory() {
        Subcategory subcategory = new Subcategory();
        subcategory.setId(UUID.randomUUID());
        subcategory.setName("Laptops");

        Product product = new Product();
        product.setSubcategory(subcategory);

        assertThat(product.getSubcategory()).isEqualTo(subcategory);
        assertThat(product.getSubcategory().getName()).isEqualTo("Laptops");
    }

    @Test
    void testProductWithBrand() {
        Brand brand = new Brand();
        brand.setId(UUID.randomUUID());
        brand.setName("Dell");

        Product product = new Product();
        product.setBrand(brand);

        assertThat(product.getBrand()).isEqualTo(brand);
        assertThat(product.getBrand().getName()).isEqualTo("Dell");
    }

    @Test
    void testProductImageAndDescription() {
        Product product = new Product();
        product.setDescription("High-performance laptop");
        product.setImageUrl("https://example.com/laptop.jpg");

        assertThat(product.getDescription()).isEqualTo("High-performance laptop");
        assertThat(product.getImageUrl()).isEqualTo("https://example.com/laptop.jpg");
    }

    @Test
    void testProductFeaturedFlag() {
        Product product = new Product();
        product.setIsFeatured(true);

        assertThat(product.getIsFeatured()).isTrue();
    }
}
