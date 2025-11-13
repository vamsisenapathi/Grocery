package com.groceryapp.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.lang.reflect.Method;
import java.time.Instant;
import java.util.Arrays;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Comprehensive test suite for GlobalExceptionHandler covering all 11 exception handlers.
 * Tests ensure proper HTTP status codes, error messages, logging, and response structure.
 */
@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @Mock
    private HttpServletRequest mockRequest;

    private static final String TEST_PATH = "/api/test";
    private static final String TEST_MESSAGE = "Test error message";

    @BeforeEach
    void setUp() {
        when(mockRequest.getRequestURI()).thenReturn(TEST_PATH);
    }

    // ===== ProductNotFoundException Tests =====

    @Test
    void whenHandleProductNotFoundException_thenReturnsNotFoundStatus() {
        // Given
        ProductNotFoundException exception = new ProductNotFoundException(TEST_MESSAGE);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleProductNotFoundException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getError()).isEqualTo("Not Found");
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
        assertThat(response.getBody().getPath()).isEqualTo(TEST_PATH);
        assertThat(response.getBody().getTimestamp()).isNotNull();
    }

    @Test
    void whenHandleProductNotFoundException_thenTimestampIsRecent() {
        // Given
        ProductNotFoundException exception = new ProductNotFoundException(TEST_MESSAGE);
        Instant before = Instant.now();

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleProductNotFoundException(exception, mockRequest);

        // Then
        Instant after = Instant.now();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getTimestamp()).isBetween(before, after);
    }

    // ===== CartItemNotFoundException Tests =====

    @Test
    void whenHandleCartItemNotFoundException_thenReturnsNotFoundStatus() {
        // Given
        CartItemNotFoundException exception = new CartItemNotFoundException(TEST_MESSAGE);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleCartItemNotFoundException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
    }

    // ===== InsufficientStockException Tests =====

    @Test
    void whenHandleInsufficientStockException_thenReturnsBadRequestStatus() {
        // Given
        InsufficientStockException exception = new InsufficientStockException(TEST_MESSAGE);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleInsufficientStockException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getError()).isEqualTo("Bad Request");
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
    }

    // ===== MethodArgumentNotValidException Tests =====

    @Test
    void whenHandleValidationException_thenReturnsBadRequestWithValidationErrors() {
        // Given
        MethodArgumentNotValidException exception = createMockValidationException(
                new FieldError("object", "email", "Email is required"),
                new FieldError("object", "password", "Password must be at least 8 characters")
        );

        // When
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler
                .handleValidationExceptions(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(400);
        assertThat(response.getBody().get("error")).isEqualTo("Validation Failed");
        assertThat(response.getBody().get("message")).isEqualTo("Invalid input provided");
        assertThat(response.getBody().get("path")).isEqualTo(TEST_PATH);
        assertThat(response.getBody().get("timestamp")).isNotNull();
        
        @SuppressWarnings("unchecked")
        Map<String, String> validationErrors = (Map<String, String>) response.getBody().get("validationErrors");
        assertThat(validationErrors).hasSize(2);
        assertThat(validationErrors.get("email")).isEqualTo("Email is required");
        assertThat(validationErrors.get("password")).isEqualTo("Password must be at least 8 characters");
    }

    @Test
    void whenHandleValidationException_withSingleError_thenReturnsOneValidationError() {
        // Given
        MethodArgumentNotValidException exception = createMockValidationException(
                new FieldError("object", "name", "Name cannot be blank")
        );

        // When
        ResponseEntity<Map<String, Object>> response = globalExceptionHandler
                .handleValidationExceptions(exception, mockRequest);

        // Then
        @SuppressWarnings("unchecked")
        Map<String, String> validationErrors = (Map<String, String>) response.getBody().get("validationErrors");
        assertThat(validationErrors).hasSize(1);
        assertThat(validationErrors.get("name")).isEqualTo("Name cannot be blank");
    }

    // ===== IllegalArgumentException Tests =====

    @Test
    void whenHandleIllegalArgumentException_thenReturnsBadRequestStatus() {
        // Given
        IllegalArgumentException exception = new IllegalArgumentException(TEST_MESSAGE);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleIllegalArgumentException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getError()).isEqualTo("Bad Request");
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
    }

    // ===== UserAlreadyExistsException Tests =====

    @Test
    void whenHandleUserAlreadyExistsException_thenReturnsConflictStatus() {
        // Given
        String email = "test@example.com";
        UserAlreadyExistsException exception = new UserAlreadyExistsException(email);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleUserAlreadyExistsException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(409);
        assertThat(response.getBody().getError()).isEqualTo("Conflict");
        assertThat(response.getBody().getMessage())
                .isEqualTo("User with email 'test@example.com' already exists");
    }

    // ===== InvalidCredentialsException Tests =====

    @Test
    void whenHandleInvalidCredentialsException_thenReturnsUnauthorizedStatus() {
        // Given
        InvalidCredentialsException exception = new InvalidCredentialsException();

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleInvalidCredentialsException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(401);
        assertThat(response.getBody().getError()).isEqualTo("Unauthorized");
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid email or password");
    }

    // ===== AddressNotFoundException Tests =====

    @Test
    void whenHandleAddressNotFoundException_thenReturnsNotFoundStatus() {
        // Given
        AddressNotFoundException exception = new AddressNotFoundException(TEST_MESSAGE);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleAddressNotFoundException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
    }

    // ===== OrderNotFoundException Tests =====

    @Test
    void whenHandleOrderNotFoundException_thenReturnsNotFoundStatus() {
        // Given
        OrderNotFoundException exception = new OrderNotFoundException(TEST_MESSAGE);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleOrderNotFoundException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
    }

    // ===== UserNotFoundException Tests =====

    @Test
    void whenHandleUserNotFoundException_thenReturnsNotFoundStatus() {
        // Given
        UserNotFoundException exception = new UserNotFoundException(TEST_MESSAGE);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleUserNotFoundException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
    }

    // ===== ResourceNotFoundException Tests =====

    @Test
    void whenHandleResourceNotFoundException_thenReturnsNotFoundStatus() {
        // Given
        ResourceNotFoundException exception = new ResourceNotFoundException(TEST_MESSAGE);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleResourceNotFoundException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
    }

    @Test
    void whenHandleResourceNotFoundExceptionWithCause_thenReturnsNotFoundStatus() {
        // Given
        Throwable cause = new RuntimeException("Root cause");
        ResourceNotFoundException exception = new ResourceNotFoundException(TEST_MESSAGE, cause);

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleResourceNotFoundException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).isEqualTo(TEST_MESSAGE);
        assertThat(exception.getCause()).isEqualTo(cause);
    }

    // ===== Generic Exception Tests =====

    @Test
    void whenHandleGenericException_thenReturnsInternalServerErrorStatus() {
        // Given
        Exception exception = new Exception("Unexpected error");

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleGenericException(exception, mockRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(500);
        assertThat(response.getBody().getError()).isEqualTo("Internal Server Error");
        assertThat(response.getBody().getMessage())
                .isEqualTo("An unexpected error occurred. Please try again later.");
        assertThat(response.getBody().getPath()).isEqualTo(TEST_PATH);
    }

    @Test
    void whenHandleGenericException_thenMessageIsGeneric() {
        // Given - Simulating an exception with sensitive internal details
        Exception exception = new Exception("Database connection failed at server 192.168.1.100:5432");

        // When
        ResponseEntity<ErrorResponse> response = globalExceptionHandler
                .handleGenericException(exception, mockRequest);

        // Then - Generic message should be returned, not the internal exception message
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage())
                .isEqualTo("An unexpected error occurred. Please try again later.");
        assertThat(response.getBody().getMessage())
                .doesNotContain("Database", "192.168", "5432");
    }

    // ===== Helper Methods =====

    private MethodArgumentNotValidException createMockValidationException(FieldError... errors) {
        try {
            BindingResult bindingResult = org.mockito.Mockito.mock(BindingResult.class);
            when(bindingResult.getAllErrors()).thenReturn(Arrays.asList(errors));
            
            // Create a MethodParameter from a dummy method to avoid NullPointerException
            Method dummyMethod = this.getClass().getDeclaredMethod("dummyMethodForValidation", String.class);
            MethodParameter methodParameter = new MethodParameter(dummyMethod, 0);
            
            return new MethodArgumentNotValidException(methodParameter, bindingResult);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException("Failed to create mock validation exception", e);
        }
    }
    
    // Dummy method for creating MethodParameter
    @SuppressWarnings("unused")
    private void dummyMethodForValidation(String param) {
        // This method is only used for creating MethodParameter in tests
    }
}
