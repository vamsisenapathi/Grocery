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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SubcategoryRepository subcategoryRepository;

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private ProductService productService;

    private Category testCategory;
    private Subcategory testSubcategory;
    private Brand testBrand;
    private Product testProduct;
    private ProductRequestDto requestDto;
    private UUID productId;
    private UUID categoryId;
    private UUID subcategoryId;
    private UUID brandId;

    @BeforeEach
    void setUp() {
        productId = UUID.randomUUID();
        categoryId = UUID.randomUUID();
        subcategoryId = UUID.randomUUID();
        brandId = UUID.randomUUID();

        testCategory = new Category();
        testCategory.setId(categoryId);
        testCategory.setName("Fruits");

        testSubcategory = new Subcategory();
        testSubcategory.setId(subcategoryId);
        testSubcategory.setName("Citrus");
        testSubcategory.setCategory(testCategory);

        testBrand = new Brand();
        testBrand.setId(brandId);
        testBrand.setName("Fresh Brand");

        testProduct = new Product();
        testProduct.setId(productId);
        testProduct.setName("Orange");
        testProduct.setDescription("Fresh oranges");
        testProduct.setPrice(BigDecimal.valueOf(5.99));
        testProduct.setMrp(BigDecimal.valueOf(7.99));
        testProduct.setCategory(testCategory);
        testProduct.setSubcategory(testSubcategory);
        testProduct.setBrand(testBrand);
        testProduct.setStock(100);
        testProduct.setUnit("kg");
        testProduct.setIsAvailable(true);
        testProduct.setIsFeatured(false);

        requestDto = new ProductRequestDto();
        requestDto.setName("Orange");
        requestDto.setDescription("Fresh oranges");
        requestDto.setPrice(BigDecimal.valueOf(5.99));
        requestDto.setMrp(BigDecimal.valueOf(7.99));
        requestDto.setCategoryId(categoryId);
        requestDto.setSubcategoryId(subcategoryId);
        requestDto.setBrandId(brandId);
        requestDto.setStock(100);
        requestDto.setUnit("kg");
        requestDto.setIsAvailable(true);
        requestDto.setIsFeatured(false);
    }

    @Test
    void createProduct_WithValidData_ShouldCreateProduct() {
        // Arrange
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        ProductResponseDto result = productService.createProduct(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Orange");
        assertThat(result.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(5.99));
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_WithInvalidCategory_ShouldThrowException() {
        // Arrange
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> productService.createProduct(requestDto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Category not found");
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void createProduct_WithoutSubcategory_ShouldCreateProduct() {
        // Arrange
        requestDto.setSubcategoryId(null);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        ProductResponseDto result = productService.createProduct(requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(productRepository, times(1)).save(any(Product.class));
        verify(subcategoryRepository, never()).findById(any());
    }

    @Test
    void createProduct_WithoutBrand_ShouldCreateProduct() {
        // Arrange
        requestDto.setBrandId(null);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        ProductResponseDto result = productService.createProduct(requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(productRepository, times(1)).save(any(Product.class));
        verify(brandRepository, never()).findById(any());
    }

    @Test
    void getAllProducts_ShouldReturnAllProducts() {
        // Arrange
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findAll()).thenReturn(products);

        // Act
        List<ProductResponseDto> result = productService.getAllProducts();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Orange");
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void getAllProducts_WhenNoProducts_ShouldReturnEmptyList() {
        // Arrange
        when(productRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<ProductResponseDto> result = productService.getAllProducts();

        // Assert
        assertThat(result).isEmpty();
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void getAllCategories_ShouldReturnDistinctCategoriesNames() {
        // Arrange
        Category category2 = new Category();
        category2.setName("Vegetables");

        Product product2 = new Product();
        product2.setCategory(category2);

        when(productRepository.findAll()).thenReturn(Arrays.asList(testProduct, product2));

        // Act
        List<String> result = productService.getAllCategories();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).contains("Fruits", "Vegetables");
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void getProductById_WithValidId_ShouldReturnProduct() {
        // Arrange
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act
        ProductResponseDto result = productService.getProductById(productId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(productId);
        assertThat(result.getName()).isEqualTo("Orange");
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    void getProductById_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(productRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> productService.getProductById(invalidId))
                .isInstanceOf(ProductNotFoundException.class);
        verify(productRepository, times(1)).findById(invalidId);
    }

    @Test
    void updateProduct_WithValidData_ShouldUpdateProduct() {
        // Arrange
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        ProductResponseDto result = productService.updateProduct(productId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void updateProduct_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(productRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> productService.updateProduct(invalidId, requestDto))
                .isInstanceOf(ProductNotFoundException.class);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void deleteProduct_WithValidId_ShouldDeleteProduct() {
        // Arrange
        when(productRepository.existsById(productId)).thenReturn(true);
        doNothing().when(productRepository).deleteById(productId);

        // Act
        productService.deleteProduct(productId);

        // Assert
        verify(productRepository, times(1)).existsById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    void deleteProduct_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(productRepository.existsById(invalidId)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> productService.deleteProduct(invalidId))
                .isInstanceOf(ProductNotFoundException.class);
        verify(productRepository, never()).deleteById(any(UUID.class));
    }

    @Test
    void getProductsByCategory_ShouldReturnFilteredProducts() {
        // Arrange
        when(productRepository.findByCategoryId(categoryId)).thenReturn(Arrays.asList(testProduct));

        // Act
        List<ProductResponseDto> result = productService.getProductsByCategory(categoryId);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategoryName()).isEqualTo("Fruits");
        verify(productRepository, times(1)).findByCategoryId(categoryId);
    }

    @Test
    void getProductsBySubcategory_ShouldReturnFilteredProducts() {
        // Arrange
        when(productRepository.findBySubcategoryId(subcategoryId)).thenReturn(Arrays.asList(testProduct));

        // Act
        List<ProductResponseDto> result = productService.getProductsBySubcategory(subcategoryId);

        // Assert
        assertThat(result).hasSize(1);
        verify(productRepository, times(1)).findBySubcategoryId(subcategoryId);
    }

    @Test
    void searchProducts_ShouldReturnMatchingProducts() {
        // Arrange
        String searchQuery = "orange";
        when(productRepository.searchByNameDescriptionOrCategory(searchQuery)).thenReturn(Arrays.asList(testProduct));

        // Act
        List<ProductResponseDto> result = productService.searchProducts(searchQuery);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).containsIgnoringCase("orange");
        verify(productRepository, times(1)).searchByNameDescriptionOrCategory(searchQuery);
    }

    @Test
    void getFeaturedProducts_ShouldReturnOnlyFeaturedProducts() {
        // Arrange
        testProduct.setIsFeatured(true);
        when(productRepository.findByIsFeaturedTrue()).thenReturn(Arrays.asList(testProduct));

        // Act
        List<ProductResponseDto> result = productService.getFeaturedProducts();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getIsFeatured()).isTrue();
        verify(productRepository, times(1)).findByIsFeaturedTrue();
    }

    // ==================== NULL PARAMETER BRANCH TESTS - createProduct ====================

    @Test
    void createProduct_WithNullMrp_ShouldUsePrice() {
        // Arrange
        requestDto.setMrp(null);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product saved = invocation.getArgument(0);
            assertThat(saved.getMrp()).isEqualByComparingTo(requestDto.getPrice());
            return testProduct;
        });

        // Act
        productService.createProduct(requestDto);

        // Assert - verified via save argument
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_WithNullStock_ShouldDefaultToZero() {
        // Arrange
        requestDto.setStock(null);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product saved = invocation.getArgument(0);
            assertThat(saved.getStock()).isEqualTo(0);
            return testProduct;
        });

        // Act
        productService.createProduct(requestDto);

        // Assert
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_WithNullDiscountPercentage_ShouldDefaultToZero() {
        // Arrange
        requestDto.setDiscountPercentage(null);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product saved = invocation.getArgument(0);
            assertThat(saved.getDiscountPercentage()).isEqualByComparingTo(BigDecimal.ZERO);
            return testProduct;
        });

        // Act
        productService.createProduct(requestDto);

        // Assert
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_WithNullIsAvailable_ShouldDefaultToTrue() {
        // Arrange
        requestDto.setIsAvailable(null);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product saved = invocation.getArgument(0);
            assertThat(saved.getIsAvailable()).isTrue();
            return testProduct;
        });

        // Act
        productService.createProduct(requestDto);

        // Assert
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_WithNullIsFeatured_ShouldDefaultToFalse() {
        // Arrange
        requestDto.setIsFeatured(null);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product saved = invocation.getArgument(0);
            assertThat(saved.getIsFeatured()).isFalse();
            return testProduct;
        });

        // Act
        productService.createProduct(requestDto);

        // Assert
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_WithNullMinOrderQuantity_ShouldDefaultToOne() {
        // Arrange
        requestDto.setMinOrderQuantity(null);
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product saved = invocation.getArgument(0);
            assertThat(saved.getMinOrderQuantity()).isEqualTo(1);
            return testProduct;
        });

        // Act
        productService.createProduct(requestDto);

        // Assert
        verify(productRepository, times(1)).save(any(Product.class));
    }

    // ==================== NULL PARAMETER BRANCH TESTS - updateProduct ====================

    @Test
    void updateProduct_WithNullMrp_ShouldUsePrice() {
        // Arrange
        requestDto.setMrp(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.updateProduct(productId, requestDto);

        // Assert - verify MRP set to price
        assertThat(testProduct.getMrp()).isEqualByComparingTo(requestDto.getPrice());
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void updateProduct_WithNullStock_ShouldDefaultToZero() {
        // Arrange
        requestDto.setStock(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.updateProduct(productId, requestDto);

        // Assert
        assertThat(testProduct.getStock()).isEqualTo(0);
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void updateProduct_WithNullDiscountPercentage_ShouldDefaultToZero() {
        // Arrange
        requestDto.setDiscountPercentage(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.updateProduct(productId, requestDto);

        // Assert
        assertThat(testProduct.getDiscountPercentage()).isEqualByComparingTo(BigDecimal.ZERO);
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void updateProduct_WithNullIsAvailable_ShouldDefaultToTrue() {
        // Arrange
        requestDto.setIsAvailable(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.updateProduct(productId, requestDto);

        // Assert
        assertThat(testProduct.getIsAvailable()).isTrue();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void updateProduct_WithNullIsFeatured_ShouldDefaultToFalse() {
        // Arrange
        requestDto.setIsFeatured(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.updateProduct(productId, requestDto);

        // Assert
        assertThat(testProduct.getIsFeatured()).isFalse();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void updateProduct_WithNullMinOrderQuantity_ShouldDefaultToOne() {
        // Arrange
        requestDto.setMinOrderQuantity(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
        when(subcategoryRepository.findById(subcategoryId)).thenReturn(Optional.of(testSubcategory));
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(testBrand));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.updateProduct(productId, requestDto);

        // Assert
        assertThat(testProduct.getMinOrderQuantity()).isEqualTo(1);
        verify(productRepository, times(1)).save(testProduct);
    }

    // ==================== EDGE CASE BRANCH TESTS - searchProducts ====================

    @Test
    void searchProducts_WithNullTerm_ShouldReturnEmptyList() {
        // Act
        List<ProductResponseDto> result = productService.searchProducts(null);

        // Assert - tests null branch
        assertThat(result).isEmpty();
        verify(productRepository, never()).searchByNameDescriptionOrCategory(any());
    }

    @Test
    void searchProducts_WithShortTerm_ShouldReturnEmptyList() {
        // Act - test length < 2 branch
        List<ProductResponseDto> result = productService.searchProducts("a");

        // Assert
        assertThat(result).isEmpty();
        verify(productRepository, never()).searchByNameDescriptionOrCategory(any());
    }

    @Test
    void searchProducts_WithEmptyTrim_ShouldReturnEmptyList() {
        // Act - test with whitespace that trims to empty
        List<ProductResponseDto> result = productService.searchProducts("  ");

        // Assert
        assertThat(result).isEmpty();
        verify(productRepository, never()).searchByNameDescriptionOrCategory(any());
    }

    // ==================== UNTESTED METHOD - decreaseStock ====================

    @Test
    void decreaseStock_WithSufficientStock_ShouldReduceQuantity() {
        // Arrange
        testProduct.setStock(10);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act
        productService.decreaseStock(productId, 5);

        // Assert
        assertThat(testProduct.getStock()).isEqualTo(5);
        assertThat(testProduct.getIsAvailable()).isTrue();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void decreaseStock_ToZero_ShouldMarkUnavailable() {
        // Arrange
        testProduct.setStock(5);
        testProduct.setIsAvailable(true);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act
        productService.decreaseStock(productId, 5);

        // Assert - tests stock == 0 branch
        assertThat(testProduct.getStock()).isEqualTo(0);
        assertThat(testProduct.getIsAvailable()).isFalse();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void decreaseStock_WithInsufficientStock_ShouldThrowException() {
        // Arrange
        testProduct.setStock(3);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act & Assert - tests insufficient stock branch
        assertThatThrownBy(() -> productService.decreaseStock(productId, 5))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Insufficient stock");
        
        verify(productRepository, never()).save(any());
    }

    @Test
    void decreaseStock_WithInvalidProductId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(productRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> productService.decreaseStock(invalidId, 5))
                .isInstanceOf(ProductNotFoundException.class);
        
        verify(productRepository, never()).save(any());
    }

    // ==================== UNTESTED METHOD - increaseStock ====================

    @Test
    void increaseStock_ShouldIncreaseQuantity() {
        // Arrange
        testProduct.setStock(10);
        testProduct.setIsAvailable(true);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act
        productService.increaseStock(productId, 5);

        // Assert
        assertThat(testProduct.getStock()).isEqualTo(15);
        assertThat(testProduct.getIsAvailable()).isTrue();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void increaseStock_FromZeroAndUnavailable_ShouldMarkAvailable() {
        // Arrange
        testProduct.setStock(0);
        testProduct.setIsAvailable(false);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act
        productService.increaseStock(productId, 10);

        // Assert - tests !isAvailable && stock > 0 branch
        assertThat(testProduct.getStock()).isEqualTo(10);
        assertThat(testProduct.getIsAvailable()).isTrue();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void increaseStock_WithInvalidProductId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(productRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> productService.increaseStock(invalidId, 5))
                .isInstanceOf(ProductNotFoundException.class);
        
        verify(productRepository, never()).save(any());
    }

    // ==================== PRIVATE METHOD COVERAGE - mapToResponseDto ====================

    @Test
    void mapToResponseDto_WithNullCategory_ShouldHandleGracefully() {
        // Arrange
        testProduct.setCategory(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act - indirectly tests mapToResponseDto null category branch
        ProductResponseDto result = productService.getProductById(productId);

        // Assert
        assertThat(result.getCategoryId()).isNull();
        assertThat(result.getCategoryName()).isNull();
    }

    @Test
    void mapToResponseDto_WithNullSubcategory_ShouldHandleGracefully() {
        // Arrange
        testProduct.setSubcategory(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act - indirectly tests mapToResponseDto null subcategory branch
        ProductResponseDto result = productService.getProductById(productId);

        // Assert
        assertThat(result.getSubcategoryId()).isNull();
        assertThat(result.getSubcategoryName()).isNull();
    }

    @Test
    void mapToResponseDto_WithNullBrand_ShouldHandleGracefully() {
        // Arrange
        testProduct.setBrand(null);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        // Act - indirectly tests mapToResponseDto null brand branch
        ProductResponseDto result = productService.getProductById(productId);

        // Assert
        assertThat(result.getBrandId()).isNull();
        assertThat(result.getBrandName()).isNull();
    }

    // ==================== PRIVATE METHOD COVERAGE - convertKebabCaseToTitleCase ====================

    @Test
    void getProductsByCategoryName_WithKebabCase_ShouldConvertToTitleCase() {
        // Arrange - indirectly tests convertKebabCaseToTitleCase
        String kebabName = "fresh-fruits";
        when(productRepository.findByCategoryName("Fresh Fruits")).thenReturn(Arrays.asList(testProduct));

        // Act
        List<ProductResponseDto> result = productService.getProductsByCategoryName(kebabName);

        // Assert
        assertThat(result).hasSize(1);
        verify(productRepository, times(1)).findByCategoryName("Fresh Fruits");
    }

    // ==================== ADDITIONAL BRANCH COVERAGE TESTS ====================

    @Test
    void convertKebabCaseToTitleCase_WithNullInput_ShouldReturnNull() {
        // Arrange & Act - indirectly tests convertKebabCaseToTitleCase null branch
        when(productRepository.findByCategoryName(null)).thenReturn(Collections.emptyList());

        // Act
        List<ProductResponseDto> result = productService.getProductsByCategoryName(null);

        // Assert
        assertThat(result).isEmpty();
        verify(productRepository, times(1)).findByCategoryName(null);
    }

    @Test
    void convertKebabCaseToTitleCase_WithEmptyString_ShouldReturnEmpty() {
        // Arrange & Act - indirectly tests convertKebabCaseToTitleCase empty branch
        when(productRepository.findByCategoryName("")).thenReturn(Collections.emptyList());

        // Act
        List<ProductResponseDto> result = productService.getProductsByCategoryName("");

        // Assert
        assertThat(result).isEmpty();
        verify(productRepository, times(1)).findByCategoryName("");
    }

    @Test
    void convertKebabCaseToTitleCase_WithSingleWord_ShouldCapitalize() {
        // Arrange - indirectly tests convertKebabCaseToTitleCase single word
        when(productRepository.findByCategoryName("Fruits")).thenReturn(Arrays.asList(testProduct));

        // Act
        List<ProductResponseDto> result = productService.getProductsByCategoryName("fruits");

        // Assert
        assertThat(result).hasSize(1);
        verify(productRepository, times(1)).findByCategoryName("Fruits");
    }

    @Test
    void convertKebabCaseToTitleCase_WithMultipleHyphens_ShouldHandleCorrectly() {
        // Arrange - tests multiple hyphens scenario
        when(productRepository.findByCategoryName("Fresh Organic Fruits")).thenReturn(Arrays.asList(testProduct));

        // Act
        List<ProductResponseDto> result = productService.getProductsByCategoryName("fresh-organic-fruits");

        // Assert
        assertThat(result).hasSize(1);
        verify(productRepository, times(1)).findByCategoryName("Fresh Organic Fruits");
    }

    @Test
    void searchProducts_WithNullSearchTerm_ShouldReturnEmptyList() {
        // Arrange & Act
        List<ProductResponseDto> result = productService.searchProducts(null);

        // Assert
        assertThat(result).isEmpty();
        verify(productRepository, never()).searchByNameDescriptionOrCategory(any());
    }

    @Test
    void searchProducts_WithSingleCharacter_ShouldReturnEmptyList() {
        // Arrange & Act
        List<ProductResponseDto> result = productService.searchProducts("a");

        // Assert
        assertThat(result).isEmpty();
        verify(productRepository, never()).searchByNameDescriptionOrCategory(any());
    }

    @Test
    void searchProducts_WithWhitespaceOnly_ShouldReturnEmptyList() {
        // Arrange & Act
        List<ProductResponseDto> result = productService.searchProducts("   ");

        // Assert
        assertThat(result).isEmpty();
        verify(productRepository, never()).searchByNameDescriptionOrCategory(any());
    }

    @Test
    void decreaseStock_WhenStockBecomesZero_ShouldSetAvailableToFalse() {
        // Arrange
        testProduct.setStock(5);
        testProduct.setIsAvailable(true);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.decreaseStock(productId, 5);

        // Assert
        assertThat(testProduct.getStock()).isEqualTo(0);
        assertThat(testProduct.getIsAvailable()).isFalse();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void decreaseStock_WhenStockRemainsPositive_ShouldKeepAvailable() {
        // Arrange
        testProduct.setStock(10);
        testProduct.setIsAvailable(true);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.decreaseStock(productId, 5);

        // Assert
        assertThat(testProduct.getStock()).isEqualTo(5);
        assertThat(testProduct.getIsAvailable()).isTrue();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void increaseStock_WhenProductWasUnavailable_ShouldSetAvailableToTrue() {
        // Arrange
        testProduct.setStock(0);
        testProduct.setIsAvailable(false);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.increaseStock(productId, 5);

        // Assert
        assertThat(testProduct.getStock()).isEqualTo(5);
        assertThat(testProduct.getIsAvailable()).isTrue();
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void increaseStock_WhenProductAlreadyAvailable_ShouldKeepAvailable() {
        // Arrange
        testProduct.setStock(5);
        testProduct.setIsAvailable(true);
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        productService.increaseStock(productId, 3);

        // Assert
        assertThat(testProduct.getStock()).isEqualTo(8);
        assertThat(testProduct.getIsAvailable()).isTrue();
        verify(productRepository, times(1)).save(testProduct);
    }
}
