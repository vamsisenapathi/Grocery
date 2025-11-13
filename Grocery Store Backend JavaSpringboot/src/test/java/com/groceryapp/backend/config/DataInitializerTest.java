package com.groceryapp.backend.config;

import com.groceryapp.backend.model.Brand;
import com.groceryapp.backend.model.Category;
import com.groceryapp.backend.model.Product;
import com.groceryapp.backend.model.Subcategory;
import com.groceryapp.backend.repository.BrandRepository;
import com.groceryapp.backend.repository.CategoryRepository;
import com.groceryapp.backend.repository.ProductRepository;
import com.groceryapp.backend.repository.SubcategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataInitializerTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SubcategoryRepository subcategoryRepository;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private DataInitializer dataInitializer;

    private Category testCategory;
    private Subcategory testSubcategory;
    private Brand testBrand;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        // Setup test entities
        testCategory = new Category();
        testCategory.setName("Test Category");
        testCategory.setDescription("Test Description");
        testCategory.setDisplayOrder(1);
        testCategory.setIsActive(true);

        testSubcategory = new Subcategory();
        testSubcategory.setName("Test Subcategory");
        testSubcategory.setDescription("Test Subcategory Description");
        testSubcategory.setCategory(testCategory);
        testSubcategory.setDisplayOrder(1);
        testSubcategory.setIsActive(true);

        testBrand = new Brand();
        testBrand.setName("Test Brand");
        testBrand.setDescription("Test Brand Description");
        testBrand.setLogoUrl("https://example.com/logo.png");
        testBrand.setIsActive(true);

        testProduct = new Product();
        testProduct.setName("Test Product");
        testProduct.setDescription("Test Product Description");
        testProduct.setPrice(new BigDecimal("100.00"));
    }

    @Test
    void testInitDatabase_WhenDatabaseAlreadyPopulated_ShouldSkipInitialization() {
        // Given: Database already has data
        when(categoryRepository.count()).thenReturn(5L);

        // When
        dataInitializer.initDatabase();

        // Then: No entities should be saved
        verify(categoryRepository, times(1)).count();
        verify(categoryRepository, never()).save(any(Category.class));
        verify(subcategoryRepository, never()).save(any(Subcategory.class));
        verify(brandRepository, never()).save(any(Brand.class));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testInitDatabase_WhenDatabaseEmpty_ShouldInitializeAllData() {
        // Given: Database is empty
        when(categoryRepository.count()).thenReturn(0L);
        
        // Mock save operations to return the entities
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category category = invocation.getArgument(0);
            return category;
        });
        
        when(subcategoryRepository.save(any(Subcategory.class))).thenAnswer(invocation -> {
            Subcategory subcategory = invocation.getArgument(0);
            return subcategory;
        });
        
        when(brandRepository.save(any(Brand.class))).thenAnswer(invocation -> {
            Brand brand = invocation.getArgument(0);
            return brand;
        });
        
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            return product;
        });

        // When
        dataInitializer.initDatabase();

        // Then: All repositories should be called
        verify(categoryRepository, times(1)).count();
        
        // Verify categories were created (4 categories in DataInitializer)
        verify(categoryRepository, atLeastOnce()).save(any(Category.class));
        
        // Verify subcategories were created
        verify(subcategoryRepository, atLeastOnce()).save(any(Subcategory.class));
        
        // Verify brands were created (4 brands in DataInitializer)
        verify(brandRepository, atLeastOnce()).save(any(Brand.class));
        
        // Verify products were created (19 products in DataInitializer)
        verify(productRepository, atLeastOnce()).save(any(Product.class));
    }

    @Test
    void testInitDatabase_CreatesCorrectNumberOfCategories() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(testSubcategory);
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        dataInitializer.initDatabase();

        // Then: Verify 4 categories were created (Fruits & Vegetables, Dairy & Bakery, Snacks & Beverages, Groceries & Staples)
        verify(categoryRepository, times(4)).save(any(Category.class));
    }

    @Test
    void testInitDatabase_CreatesCorrectNumberOfBrands() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(testSubcategory);
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        dataInitializer.initDatabase();

        // Then: Verify 4 brands were created (Amul, Tata, Britannia, Haldiram)
        verify(brandRepository, times(4)).save(any(Brand.class));
    }

    @Test
    void testInitDatabase_CreatesCorrectNumberOfSubcategories() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(testSubcategory);
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        dataInitializer.initDatabase();

        // Then: Verify 11 subcategories were created
        // Fruits & Vegetables: 2, Dairy & Bakery: 3, Snacks & Beverages: 3, Groceries & Staples: 3
        verify(subcategoryRepository, times(11)).save(any(Subcategory.class));
    }

    @Test
    void testInitDatabase_CreatesCorrectNumberOfProducts() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(testSubcategory);
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        dataInitializer.initDatabase();

        // Then: Verify 17 products were created
        // 3 fruits + 3 vegetables + 3 dairy + 3 snacks + 2 beverages + 3 groceries = 17 products
        verify(productRepository, times(17)).save(any(Product.class));
    }

    @Test
    void testInitDatabase_CategoryHasCorrectProperties() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        
        // Capture the saved category
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category savedCategory = invocation.getArgument(0);
            
            // Verify at least one category has expected properties
            if ("Fruits & Vegetables".equals(savedCategory.getName())) {
                assertThat(savedCategory.getDescription()).isEqualTo("Fresh fruits and vegetables");
                assertThat(savedCategory.getDisplayOrder()).isEqualTo(1);
                assertThat(savedCategory.getIsActive()).isTrue();
                assertThat(savedCategory.getImageUrl()).contains("fruits-vegetables");
            }
            
            return savedCategory;
        });
        
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(testSubcategory);
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        dataInitializer.initDatabase();

        // Then: Verification happens in the mock answer
        verify(categoryRepository, times(4)).save(any(Category.class));
    }

    @Test
    void testInitDatabase_SubcategoryLinkedToCategory() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        
        Category fruitsCategory = new Category();
        fruitsCategory.setName("Fruits & Vegetables");
        
        when(categoryRepository.save(any(Category.class))).thenReturn(fruitsCategory);
        
        when(subcategoryRepository.save(any(Subcategory.class))).thenAnswer(invocation -> {
            Subcategory savedSubcategory = invocation.getArgument(0);
            
            // Verify subcategory is linked to a category
            assertThat(savedSubcategory.getCategory()).isNotNull();
            assertThat(savedSubcategory.getIsActive()).isTrue();
            
            return savedSubcategory;
        });
        
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        dataInitializer.initDatabase();

        // Then: Verification happens in the mock answer
        verify(subcategoryRepository, times(11)).save(any(Subcategory.class));
    }

    @Test
    void testInitDatabase_BrandHasCorrectProperties() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(testSubcategory);
        
        when(brandRepository.save(any(Brand.class))).thenAnswer(invocation -> {
            Brand savedBrand = invocation.getArgument(0);
            
            // Verify brand properties
            assertThat(savedBrand.getName()).isNotBlank();
            assertThat(savedBrand.getDescription()).isNotBlank();
            assertThat(savedBrand.getLogoUrl()).startsWith("https://");
            assertThat(savedBrand.getIsActive()).isTrue();
            
            return savedBrand;
        });
        
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        dataInitializer.initDatabase();

        // Then: Verification happens in the mock answer
        verify(brandRepository, times(4)).save(any(Brand.class));
    }

    @Test
    void testInitDatabase_ProductHasCorrectProperties() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(testSubcategory);
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product savedProduct = invocation.getArgument(0);
            
            // Verify product properties
            assertThat(savedProduct.getName()).isNotBlank();
            assertThat(savedProduct.getDescription()).isNotBlank();
            assertThat(savedProduct.getPrice()).isGreaterThan(BigDecimal.ZERO);
            assertThat(savedProduct.getMrp()).isGreaterThan(savedProduct.getPrice()); // MRP > Price
            assertThat(savedProduct.getStock()).isGreaterThan(0);
            assertThat(savedProduct.getUnit()).isNotBlank();
            assertThat(savedProduct.getQuantityPerUnit()).isNotNull();
            assertThat(savedProduct.getDiscountPercentage()).isEqualByComparingTo(new BigDecimal("10"));
            assertThat(savedProduct.getRating()).isEqualByComparingTo(new BigDecimal("4.2"));
            assertThat(savedProduct.getReviewCount()).isEqualTo(150);
            assertThat(savedProduct.getIsAvailable()).isTrue();
            assertThat(savedProduct.getIsFeatured()).isFalse();
            assertThat(savedProduct.getMinOrderQuantity()).isEqualTo(1);
            assertThat(savedProduct.getMaxOrderQuantity()).isEqualTo(10);
            
            return savedProduct;
        });

        // When
        dataInitializer.initDatabase();

        // Then: Verification happens in the mock answer
        verify(productRepository, times(17)).save(any(Product.class));
    }

    @Test
    void testInitDatabase_ProductLinkedToSubcategoryAndCategory() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        
        Category savedCategory = new Category();
        savedCategory.setName("Test Category");
        when(categoryRepository.save(any(Category.class))).thenReturn(savedCategory);
        
        Subcategory savedSubcategory = new Subcategory();
        savedSubcategory.setName("Test Subcategory");
        savedSubcategory.setCategory(savedCategory);
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(savedSubcategory);
        
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product savedProduct = invocation.getArgument(0);
            
            // Verify product is linked to category and subcategory
            assertThat(savedProduct.getCategory()).isNotNull();
            assertThat(savedProduct.getSubcategory()).isNotNull();
            
            return savedProduct;
        });

        // When
        dataInitializer.initDatabase();

        // Then: Verification happens in the mock answer
        verify(productRepository, times(17)).save(any(Product.class));
    }

    @Test
    void testInitDatabase_SomeProductsHaveBrand_OthersDoNot() {
        // Given
        when(categoryRepository.count()).thenReturn(0L);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        when(subcategoryRepository.save(any(Subcategory.class))).thenReturn(testSubcategory);
        when(brandRepository.save(any(Brand.class))).thenReturn(testBrand);
        
        int[] productsWithBrand = {0};
        int[] productsWithoutBrand = {0};
        
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product savedProduct = invocation.getArgument(0);
            
            // Count products with and without brands
            if (savedProduct.getBrand() != null) {
                productsWithBrand[0]++;
            } else {
                productsWithoutBrand[0]++;
            }
            
            return savedProduct;
        });

        // When
        dataInitializer.initDatabase();

        // Then: Some products should have brands, some should not
        assertThat(productsWithBrand[0]).isGreaterThan(0);
        assertThat(productsWithoutBrand[0]).isGreaterThan(0);
    }
}
