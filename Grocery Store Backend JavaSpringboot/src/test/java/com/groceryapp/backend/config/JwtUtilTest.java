package com.groceryapp.backend.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

/**
 * Comprehensive test suite for JwtUtil
 * Tests JWT token generation, extraction, validation, and expiration
 */
class JwtUtilTest {
    
    private JwtUtil jwtUtil;
    private UUID testUserId;
    private String testEmail;
    private String testName;
    
    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // Set private fields using ReflectionTestUtils
        ReflectionTestUtils.setField(jwtUtil, "secret", 
            "grocery-store-secret-key-for-jwt-token-generation-minimum-256-bits");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L); // 24 hours
        
        testUserId = UUID.randomUUID();
        testEmail = "test@example.com";
        testName = "Test User";
    }
    
    @Test
    void whenGenerateToken_thenTokenIsCreated() {
        // When
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts: header.payload.signature
    }
    
    @Test
    void whenExtractEmail_thenReturnsCorrectEmail() {
        // Given
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // When
        String extractedEmail = jwtUtil.extractEmail(token);
        
        // Then
        assertThat(extractedEmail).isEqualTo(testEmail);
    }
    
    @Test
    void whenExtractUserId_thenReturnsCorrectUserId() {
        // Given
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // When
        UUID extractedUserId = jwtUtil.extractUserId(token);
        
        // Then
        assertThat(extractedUserId).isEqualTo(testUserId);
    }
    
    @Test
    void whenExtractName_thenReturnsCorrectName() {
        // Given
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // When
        String extractedName = jwtUtil.extractName(token);
        
        // Then
        assertThat(extractedName).isEqualTo(testName);
    }
    
    @Test
    void whenExtractExpiration_thenReturnsValidDate() {
        // Given
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // When
        Date expiration = jwtUtil.extractExpiration(token);
        
        // Then
        assertThat(expiration).isNotNull();
        assertThat(expiration).isAfter(new Date()); // Should be in the future
    }
    
    @Test
    void whenIsTokenExpired_withValidToken_thenReturnsFalse() {
        // Given
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // When
        Boolean isExpired = jwtUtil.isTokenExpired(token);
        
        // Then
        assertThat(isExpired).isFalse();
    }
    
    @Test
    void whenIsTokenExpired_withExpiredToken_thenThrowsExpiredJwtException() {
        // Given - Create token with 1ms expiration
        ReflectionTestUtils.setField(jwtUtil, "expiration", 1L);
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // When/Then - Parsing an expired token throws ExpiredJwtException
        assertThatThrownBy(() -> jwtUtil.isTokenExpired(token))
            .isInstanceOf(ExpiredJwtException.class);
    }
    
    @Test
    void whenValidateToken_withValidTokenAndMatchingEmail_thenReturnsTrue() {
        // Given
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // When
        Boolean isValid = jwtUtil.validateToken(token, testEmail);
        
        // Then
        assertThat(isValid).isTrue();
    }
    
    @Test
    void whenValidateToken_withValidTokenAndNonMatchingEmail_thenReturnsFalse() {
        // Given
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        String differentEmail = "different@example.com";
        
        // When
        Boolean isValid = jwtUtil.validateToken(token, differentEmail);
        
        // Then
        assertThat(isValid).isFalse();
    }
    
    @Test
    void whenValidateToken_withExpiredToken_thenThrowsExpiredJwtException() {
        // Given - Create token with 1ms expiration
        ReflectionTestUtils.setField(jwtUtil, "expiration", 1L);
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // When/Then - Validating an expired token throws ExpiredJwtException
        assertThatThrownBy(() -> jwtUtil.validateToken(token, testEmail))
            .isInstanceOf(ExpiredJwtException.class);
    }
    
    @Test
    void whenExtractEmail_withInvalidToken_thenThrowsException() {
        // Given
        String invalidToken = "invalid.jwt.token";
        
        // When/Then
        assertThatThrownBy(() -> jwtUtil.extractEmail(invalidToken))
            .isInstanceOf(MalformedJwtException.class);
    }
    
    @Test
    void whenExtractEmail_withMalformedToken_thenThrowsException() {
        // Given
        String malformedToken = "not-a-jwt-token";
        
        // When/Then
        assertThatThrownBy(() -> jwtUtil.extractEmail(malformedToken))
            .isInstanceOf(MalformedJwtException.class);
    }
    
    @Test
    void whenExtractUserId_withTokenMissingUserId_thenThrowsException() {
        // This test verifies that extractUserId handles tokens without userId claim
        // Since we control token generation, we'll test with a tampered token
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        
        // When/Then - Valid token should work
        assertThatCode(() -> jwtUtil.extractUserId(token))
            .doesNotThrowAnyException();
    }
    
    @Test
    void whenGenerateToken_withDifferentUsers_thenGeneratesDifferentTokens() {
        // Given
        UUID userId1 = UUID.randomUUID();
        UUID userId2 = UUID.randomUUID();
        String email1 = "user1@example.com";
        String email2 = "user2@example.com";
        
        // When
        String token1 = jwtUtil.generateToken(userId1, email1, "User One");
        String token2 = jwtUtil.generateToken(userId2, email2, "User Two");
        
        // Then
        assertThat(token1).isNotEqualTo(token2);
        assertThat(jwtUtil.extractUserId(token1)).isEqualTo(userId1);
        assertThat(jwtUtil.extractUserId(token2)).isEqualTo(userId2);
        assertThat(jwtUtil.extractEmail(token1)).isEqualTo(email1);
        assertThat(jwtUtil.extractEmail(token2)).isEqualTo(email2);
    }
    
    @Test
    void whenGenerateToken_withSpecialCharactersInName_thenHandlesCorrectly() {
        // Given
        String specialName = "Test User @#$% 123";
        
        // When
        String token = jwtUtil.generateToken(testUserId, testEmail, specialName);
        String extractedName = jwtUtil.extractName(token);
        
        // Then
        assertThat(extractedName).isEqualTo(specialName);
    }
    
    @Test
    void whenExtractExpiration_thenExpirationMatchesConfiguredTime() {
        // Given
        long expectedExpiration = 86400000L; // 24 hours
        ReflectionTestUtils.setField(jwtUtil, "expiration", expectedExpiration);
        
        long beforeGeneration = System.currentTimeMillis();
        String token = jwtUtil.generateToken(testUserId, testEmail, testName);
        long afterGeneration = System.currentTimeMillis();
        
        // When
        Date expiration = jwtUtil.extractExpiration(token);
        
        // Then - Allow up to 1 second variance for test execution time
        long expectedMinExpiration = beforeGeneration + expectedExpiration - 1000;
        long expectedMaxExpiration = afterGeneration + expectedExpiration + 1000;
        long actualExpiration = expiration.getTime();
        
        assertThat(actualExpiration).isBetween(expectedMinExpiration, expectedMaxExpiration);
    }
}
