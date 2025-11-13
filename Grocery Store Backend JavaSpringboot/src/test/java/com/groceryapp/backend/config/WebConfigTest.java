package com.groceryapp.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test suite for WebConfig
 * Tests CORS configuration for cross-origin requests
 */
class WebConfigTest {
    
    @Test
    void whenCorsConfigurer_thenWebMvcConfigurerBeanIsCreated() {
        // Given
        WebConfig webConfig = new WebConfig();
        
        // When
        WebMvcConfigurer configurer = webConfig.corsConfigurer();
        
        // Then
        assertThat(configurer).isNotNull();
        assertThat(configurer).isInstanceOf(WebMvcConfigurer.class);
    }
    
    @Test
    void whenCorsConfigurer_thenConfiguresAllMappings() {
        // Given
        WebConfig webConfig = new WebConfig();
        WebMvcConfigurer configurer = webConfig.corsConfigurer();
        TestCorsRegistry registry = new TestCorsRegistry();
        
        // When
        configurer.addCorsMappings(registry);
        
        // Then
        assertThat(registry.wasAddMappingCalled()).isTrue();
        assertThat(registry.getMapping()).isEqualTo("/**");
    }
    
    @Test
    void whenAddCorsMappings_thenConfiguresCorrectly() {
        // Given
        WebConfig webConfig = new WebConfig();
        WebMvcConfigurer configurer = webConfig.corsConfigurer();
        TestCorsRegistry registry = new TestCorsRegistry();
        
        // When
        configurer.addCorsMappings(registry);
        
        // Then - Verify CORS configuration was applied
        assertThat(registry.wasAddMappingCalled()).isTrue();
    }
    
    /**
     * Test implementation of CorsRegistry to verify configuration
     */
    private static class TestCorsRegistry extends CorsRegistry {
        private boolean addMappingCalled = false;
        private String mapping;
        
        @Override
        public org.springframework.web.servlet.config.annotation.CorsRegistration addMapping(String pathPattern) {
            this.addMappingCalled = true;
            this.mapping = pathPattern;
            return super.addMapping(pathPattern);
        }
        
        public boolean wasAddMappingCalled() {
            return addMappingCalled;
        }
        
        public String getMapping() {
            return mapping;
        }
    }
}
