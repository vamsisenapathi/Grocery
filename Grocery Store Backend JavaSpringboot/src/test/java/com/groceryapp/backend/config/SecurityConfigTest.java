package com.groceryapp.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test suite for SecurityConfig
 * Tests password encoder bean configuration
 */
class SecurityConfigTest {
    
    @Test
    void whenPasswordEncoder_thenBCryptPasswordEncoderBeanIsCreated() {
        // Given
        SecurityConfig securityConfig = new SecurityConfig();
        
        // When
        BCryptPasswordEncoder encoder = securityConfig.passwordEncoder();
        
        // Then
        assertThat(encoder).isNotNull();
        assertThat(encoder).isInstanceOf(BCryptPasswordEncoder.class);
    }
    
    @Test
    void whenPasswordEncoder_thenCanEncodePasswords() {
        // Given
        SecurityConfig securityConfig = new SecurityConfig();
        BCryptPasswordEncoder encoder = securityConfig.passwordEncoder();
        String rawPassword = "testPassword123";
        
        // When
        String encodedPassword = encoder.encode(rawPassword);
        
        // Then
        assertThat(encodedPassword).isNotNull();
        assertThat(encodedPassword).isNotEqualTo(rawPassword);
        assertThat(encodedPassword).startsWith("$2a$"); // BCrypt format
    }
    
    @Test
    void whenPasswordEncoder_thenCanVerifyPasswords() {
        // Given
        SecurityConfig securityConfig = new SecurityConfig();
        BCryptPasswordEncoder encoder = securityConfig.passwordEncoder();
        String rawPassword = "mySecurePassword";
        String encodedPassword = encoder.encode(rawPassword);
        
        // When
        boolean matches = encoder.matches(rawPassword, encodedPassword);
        
        // Then
        assertThat(matches).isTrue();
    }
    
    @Test
    void whenPasswordEncoder_thenDifferentPasswordsDoNotMatch() {
        // Given
        SecurityConfig securityConfig = new SecurityConfig();
        BCryptPasswordEncoder encoder = securityConfig.passwordEncoder();
        String password1 = "password1";
        String password2 = "password2";
        String encodedPassword1 = encoder.encode(password1);
        
        // When
        boolean matches = encoder.matches(password2, encodedPassword1);
        
        // Then
        assertThat(matches).isFalse();
    }
    
    @Test
    void whenPasswordEncoder_thenSamePasswordEncodedTwiceProducesDifferentHashes() {
        // Given
        SecurityConfig securityConfig = new SecurityConfig();
        BCryptPasswordEncoder encoder = securityConfig.passwordEncoder();
        String password = "testPassword";
        
        // When
        String encoded1 = encoder.encode(password);
        String encoded2 = encoder.encode(password);
        
        // Then
        assertThat(encoded1).isNotEqualTo(encoded2); // BCrypt uses salt, so same password produces different hashes
        assertThat(encoder.matches(password, encoded1)).isTrue();
        assertThat(encoder.matches(password, encoded2)).isTrue();
    }
}
