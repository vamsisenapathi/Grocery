package com.groceryapp.backend.config;

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
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    
    @PostConstruct
    public void initDatabase() {
        if (categoryRepository.count() > 0) {
            log.info("Database already populated, skipping initialization");
            return;
        }
            
            log.info("Initializing database with sample data...");
            
            // Create Brands
            Brand amul = createBrand("Amul", "India's leading dairy brand", "https://example.com/amul-logo.png");
            Brand tata = createBrand("Tata", "Tata Consumer Products", "https://example.com/tata-logo.png");
            // Brand nestle = createBrand("Nestle", "Global food and beverage company", "https://example.com/nestle-logo.png");
            Brand britannia = createBrand("Britannia", "Leading biscuit manufacturer", "https://example.com/britannia-logo.png");
            Brand haldiram = createBrand("Haldiram's", "Popular Indian snacks brand", "https://example.com/haldiram-logo.png");
            
            // Create Categories and Subcategories
            
            // 1. Fruits & Vegetables
            Category fruitsVeg = createCategory("Fruits & Vegetables", "Fresh fruits and vegetables", 1);
            Subcategory freshFruits = createSubcategory("Fresh Fruits", "Seasonal fresh fruits", fruitsVeg, 1);
            Subcategory freshVegetables = createSubcategory("Fresh Vegetables", "Farm fresh vegetables", fruitsVeg, 2);
            // Subcategory exoticFruits = createSubcategory("Exotic Fruits", "Imported exotic fruits", fruitsVeg, 3);
            
            // 2. Dairy & Bakery
            Category dairy = createCategory("Dairy & Bakery", "Milk, bread, and bakery items", 2);
            Subcategory milk = createSubcategory("Milk & Cream", "Fresh dairy products", dairy, 1);
            Subcategory bread = createSubcategory("Bread & Pav", "Fresh bread and bakery", dairy, 2);
            Subcategory cheese = createSubcategory("Cheese & Butter", "Dairy spreads", dairy, 3);
            
            // 3. Snacks & Beverages
            Category snacks = createCategory("Snacks & Beverages", "Snacks, chips, and drinks", 3);
            Subcategory chips = createSubcategory("Chips & Namkeen", "Savory snacks", snacks, 1);
            Subcategory biscuits = createSubcategory("Biscuits & Cookies", "Sweet treats", snacks, 2);
            Subcategory beverages = createSubcategory("Cold Drinks & Juices", "Refreshing beverages", snacks, 3);
            
            // 4. Groceries & Staples
            Category groceries = createCategory("Groceries & Staples", "Essential groceries", 4);
            Subcategory rice = createSubcategory("Rice & Atta", "Staple grains", groceries, 1);
            Subcategory pulses = createSubcategory("Dal & Pulses", "Lentils and pulses", groceries, 2);
            Subcategory oil = createSubcategory("Oils & Ghee", "Cooking oils", groceries, 3);
            
            // 5. Personal Care
            // Category personal = createCategory("Personal Care", "Health and hygiene products", 5);
            // Subcategory skincare = createSubcategory("Skin Care", "Face and body care", personal, 1);
            // Subcategory haircare = createSubcategory("Hair Care", "Shampoos and conditioners", personal, 2);
            
            // 6. Household Items
            // Category household = createCategory("Household Items", "Cleaning and home essentials", 6);
            // Subcategory cleaning = createSubcategory("Cleaning Supplies", "Detergents and cleaners", household, 1);
            // Subcategory kitchenware = createSubcategory("Kitchen Essentials", "Utensils and accessories", household, 2);
            
            log.info("Created categories and subcategories");
            
            // Create Sample Products
            
            // Fruits
            createProduct("Apple - Royal Gala", "Fresh imported apples", new BigDecimal("180.00"), 
                freshFruits, null, new BigDecimal("1"), "kg", "https://example.com/apple.jpg", 50);
            
            createProduct("Banana - Robusta", "Fresh yellow bananas", new BigDecimal("50.00"), 
                freshFruits, null, new BigDecimal("1"), "dozen", "https://example.com/banana.jpg", 100);
            
            createProduct("Mango - Alphonso", "Premium Alphonso mangoes", new BigDecimal("250.00"), 
                freshFruits, null, new BigDecimal("1"), "dozen", "https://example.com/mango.jpg", 30);
            
            // Vegetables
            createProduct("Tomato - Local", "Fresh red tomatoes", new BigDecimal("40.00"), 
                freshVegetables, null, new BigDecimal("1"), "kg", "https://example.com/tomato.jpg", 80);
            
            createProduct("Onion", "Fresh onions", new BigDecimal("35.00"), 
                freshVegetables, null, new BigDecimal("1"), "kg", "https://example.com/onion.jpg", 100);
            
            createProduct("Potato", "Farm fresh potatoes", new BigDecimal("30.00"), 
                freshVegetables, null, new BigDecimal("1"), "kg", "https://example.com/potato.jpg", 150);
            
            // Dairy
            createProduct("Amul Taaza Toned Milk", "Fresh toned milk", new BigDecimal("28.00"), 
                milk, amul, new BigDecimal("0.5"), "L", "https://example.com/milk.jpg", 200);
            
            createProduct("Amul Butter", "Delicious table butter", new BigDecimal("55.00"), 
                cheese, amul, new BigDecimal("100"), "g", "https://example.com/butter.jpg", 150);
            
            createProduct("Britannia Bread", "Whole wheat bread", new BigDecimal("45.00"), 
                bread, britannia, new BigDecimal("400"), "g", "https://example.com/bread.jpg", 100);
            
            // Snacks
            createProduct("Lay's Potato Chips", "Classic salted chips", new BigDecimal("20.00"), 
                chips, null, new BigDecimal("50"), "g", "https://example.com/lays.jpg", 200);
            
            createProduct("Haldiram Namkeen", "Spicy Indian snack", new BigDecimal("35.00"), 
                chips, haldiram, new BigDecimal("200"), "g", "https://example.com/namkeen.jpg", 150);
            
            createProduct("Britannia Good Day", "Butter cookies", new BigDecimal("30.00"), 
                biscuits, britannia, new BigDecimal("100"), "g", "https://example.com/goodday.jpg", 180);
            
            // Beverages
            createProduct("Coca Cola", "Refreshing cold drink", new BigDecimal("40.00"), 
                beverages, null, new BigDecimal("1"), "L", "https://example.com/coke.jpg", 120);
            
            createProduct("Real Fruit Juice", "100% fruit juice", new BigDecimal("85.00"), 
                beverages, null, new BigDecimal("1"), "L", "https://example.com/real.jpg", 90);
            
            // Groceries
            createProduct("Tata Sampann Toor Dal", "Premium quality dal", new BigDecimal("150.00"), 
                pulses, tata, new BigDecimal("1"), "kg", "https://example.com/dal.jpg", 100);
            
            createProduct("India Gate Basmati Rice", "Premium basmati rice", new BigDecimal("180.00"), 
                rice, null, new BigDecimal("1"), "kg", "https://example.com/rice.jpg", 80);
            
            createProduct("Fortune Sunlite Oil", "Refined sunflower oil", new BigDecimal("145.00"), 
                oil, null, new BigDecimal("1"), "L", "https://example.com/oil.jpg", 70);
            
            log.info("Database initialization completed successfully!");
    }
    
    private Category createCategory(String name, String description, int displayOrder) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setDisplayOrder(displayOrder);
        category.setIsActive(true);
        category.setImageUrl("https://example.com/" + name.toLowerCase().replace(" & ", "-").replace(" ", "-") + ".jpg");
        return categoryRepository.save(category);
    }
    
    private Subcategory createSubcategory(String name, String description, Category category, int displayOrder) {
        Subcategory subcategory = new Subcategory();
        subcategory.setName(name);
        subcategory.setDescription(description);
        subcategory.setCategory(category);
        subcategory.setDisplayOrder(displayOrder);
        subcategory.setIsActive(true);
        return subcategoryRepository.save(subcategory);
    }
    
    private Brand createBrand(String name, String description, String logoUrl) {
        Brand brand = new Brand();
        brand.setName(name);
        brand.setDescription(description);
        brand.setLogoUrl(logoUrl);
        brand.setIsActive(true);
        return brandRepository.save(brand);
    }
    
    private void createProduct(String name, String description, BigDecimal price, 
                               Subcategory subcategory, Brand brand, BigDecimal quantity, 
                               String unit, String imageUrl, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setMrp(price.multiply(new BigDecimal("1.1"))); // MRP is 10% more
        product.setCategory(subcategory.getCategory());
        product.setSubcategory(subcategory);
        product.setBrand(brand);
        product.setStock(stock);
        product.setUnit(unit);
        product.setQuantityPerUnit(quantity);
        product.setWeightQuantity(quantity.toString() + " " + unit);
        product.setDiscountPercentage(new BigDecimal("10")); // 10% discount
        product.setRating(new BigDecimal("4.2"));
        product.setReviewCount(150);
        product.setImageUrl(imageUrl);
        product.setIsAvailable(true);
        product.setIsFeatured(false);
        product.setMinOrderQuantity(1);
        product.setMaxOrderQuantity(10);
        productRepository.save(product);
    }
}
