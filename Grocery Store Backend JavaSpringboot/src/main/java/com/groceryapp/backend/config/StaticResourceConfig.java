package com.groceryapp.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
@Slf4j
public class StaticResourceConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded images from /uploads/** URL pattern
        String uploadsPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        log.info("Configuring static resource handler:");
        log.info("  Resource pattern: /uploads/**");
        log.info("  Resource location: {}", uploadsPath);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadsPath)
                .setCachePeriod(3600);
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/uploads/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "HEAD");
    }
}
