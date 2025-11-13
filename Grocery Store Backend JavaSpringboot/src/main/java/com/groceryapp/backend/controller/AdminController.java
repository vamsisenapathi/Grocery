package com.groceryapp.backend.controller;

import com.groceryapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;
    
    @PostMapping("/load-products")
    public ResponseEntity<Map<String, Object>> loadProducts() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            log.info("Starting product load from SQL file...");
            
            // Read the SQL file from the project root
            String sqlFilePath = "c:\\Vamsi\\React js\\App\\Grocery Store\\Grocery Store Backend JavaSpringboot\\COMPLETE_784_PRODUCTS.sql";
            String sql = Files.readString(Paths.get(sqlFilePath), StandardCharsets.UTF_8);
            
            // Split by semicolon and execute each statement
            String[] statements = sql.split(";");
            int executedCount = 0;
            
            for (String statement : statements) {
                String trimmed = statement.trim();
                if (!trimmed.isEmpty() && !trimmed.startsWith("--")) {
                    try {
                        jdbcTemplate.execute(trimmed);
                        executedCount++;
                    } catch (Exception e) {
                        log.error("Error executing statement: " + trimmed.substring(0, Math.min(100, trimmed.length())), e);
                        throw e;
                    }
                }
            }
            
            // Get total product count
            Integer totalProducts = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Integer.class);
            
            response.put("success", true);
            response.put("message", "Products loaded successfully");
            response.put("statementsExecuted", executedCount);
            response.put("totalProducts", totalProducts);
            
            log.info("Product load completed. Total products: {}", totalProducts);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error loading products", e);
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/product-stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Integer totalProducts = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM products", Integer.class);
            
            // Get count by category
            String categoryQuery = "SELECT c.name as category, COUNT(p.id) as count " +
                                  "FROM categories c " +
                                  "LEFT JOIN products p ON c.id = p.category_id " +
                                  "GROUP BY c.name " +
                                  "ORDER BY count DESC";
            
            var categoryStats = jdbcTemplate.queryForList(categoryQuery);
            
            response.put("totalProducts", totalProducts);
            response.put("categoryCounts", categoryStats);
            response.put("success", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error getting product stats", e);
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            var users = userRepository.findAll();
            
            // Map to safe user info (no passwords)
            List<Map<String, Object>> userList = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("email", user.getEmail());
                    userMap.put("name", user.getName());
                    userMap.put("phoneNumber", user.getPhoneNumber());
                    userMap.put("createdAt", user.getCreatedAt());
                    return userMap;
                })
                .collect(Collectors.toList());
            
            response.put("success", true);
            response.put("users", userList);
            response.put("totalUsers", userList.size());
            
            log.info("Retrieved {} users", userList.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error getting users", e);
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
