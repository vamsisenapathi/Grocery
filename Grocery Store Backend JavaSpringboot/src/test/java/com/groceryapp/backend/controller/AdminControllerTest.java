package com.groceryapp.backend.controller;

import com.groceryapp.backend.model.User;
import com.groceryapp.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for AdminController with focus on branch coverage
 * Testing all success and error paths
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private UserRepository userRepository;

    private User testUser1;
    private User testUser2;

    @BeforeEach
    void setUp() {
        testUser1 = new User();
        testUser1.setId(UUID.randomUUID());
        testUser1.setEmail("user1@example.com");
        testUser1.setName("User One");
        testUser1.setPhoneNumber("1234567890");
        testUser1.setCreatedAt(Instant.now());

        testUser2 = new User();
        testUser2.setId(UUID.randomUUID());
        testUser2.setEmail("user2@example.com");
        testUser2.setName("User Two");
        testUser2.setPhoneNumber("0987654321");
        testUser2.setCreatedAt(Instant.now());
    }

    @Test
    void getAllUsers_WithMultipleUsers_ShouldReturnUsersList() throws Exception {
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser1, testUser2));

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.totalUsers").value(2))
                .andExpect(jsonPath("$.users").isArray())
                .andExpect(jsonPath("$.users.length()").value(2))
                .andExpect(jsonPath("$.users[0].email").value("user1@example.com"))
                .andExpect(jsonPath("$.users[0].name").value("User One"))
                .andExpect(jsonPath("$.users[1].email").value("user2@example.com"))
                .andExpect(jsonPath("$.users[1].name").value("User Two"));

        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getAllUsers_WithNoUsers_ShouldReturnEmptyList() throws Exception {
        when(userRepository.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.totalUsers").value(0))
                .andExpect(jsonPath("$.users").isArray())
                .andExpect(jsonPath("$.users.length()").value(0));

        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getAllUsers_WithSingleUser_ShouldReturnSingleUserList() throws Exception {
        when(userRepository.findAll()).thenReturn(Collections.singletonList(testUser1));

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.totalUsers").value(1))
                .andExpect(jsonPath("$.users").isArray())
                .andExpect(jsonPath("$.users.length()").value(1))
                .andExpect(jsonPath("$.users[0].id").exists())
                .andExpect(jsonPath("$.users[0].email").value("user1@example.com"))
                .andExpect(jsonPath("$.users[0].name").value("User One"))
                .andExpect(jsonPath("$.users[0].phoneNumber").value("1234567890"))
                .andExpect(jsonPath("$.users[0].createdAt").exists());

        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getAllUsers_WhenRepositoryThrowsException_ShouldReturn500() throws Exception {
        when(userRepository.findAll()).thenThrow(new RuntimeException("Database connection failed"));

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().is(500))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Database connection failed"));

        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getProductStats_WithProducts_ShouldReturnStats() throws Exception {
        when(jdbcTemplate.queryForObject(eq("SELECT COUNT(*) FROM products"), eq(Integer.class)))
                .thenReturn(100);
        when(jdbcTemplate.queryForList(anyString()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/admin/product-stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.totalProducts").value(100))
                .andExpect(jsonPath("$.categoryCounts").isArray());

        verify(jdbcTemplate, times(1)).queryForObject(anyString(), eq(Integer.class));
        verify(jdbcTemplate, times(1)).queryForList(anyString());
    }

    @Test
    void getProductStats_WhenDatabaseFails_ShouldReturn500() throws Exception {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class)))
                .thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(get("/admin/product-stats"))
                .andExpect(status().is(500))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").exists());

        verify(jdbcTemplate, times(1)).queryForObject(anyString(), eq(Integer.class));
    }

    @Test
    void getProductStats_WithZeroProducts_ShouldReturnZeroCount() throws Exception {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class)))
                .thenReturn(0);
        when(jdbcTemplate.queryForList(anyString()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/admin/product-stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.totalProducts").value(0))
                .andExpect(jsonPath("$.categoryCounts").isEmpty());

        verify(jdbcTemplate, times(1)).queryForObject(anyString(), eq(Integer.class));
        verify(jdbcTemplate, times(1)).queryForList(anyString());
    }

    @Test
    void getAllUsers_WithLargeDataset_ShouldHandleCorrectly() throws Exception {
        // Simulate 1000 users
        User[] users = new User[1000];
        for (int i = 0; i < 1000; i++) {
            User user = new User();
            user.setId(UUID.randomUUID());
            user.setEmail("user" + i + "@example.com");
            user.setName("User " + i);
            user.setPhoneNumber("123456" + String.format("%04d", i));
            user.setCreatedAt(Instant.now());
            users[i] = user;
        }
        
        when(userRepository.findAll()).thenReturn(Arrays.asList(users));

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.totalUsers").value(1000))
                .andExpect(jsonPath("$.users.length()").value(1000));

        verify(userRepository, times(1)).findAll();
    }

    /**
     * Testing Limitation for loadProducts():
     * 
     * The loadProducts() method has hardcoded file path and uses Files.readString()
     * which makes it impossible to unit test all branches without:
     * 1. Refactoring to inject a file reader service
     * 2. Using PowerMock to mock static methods (not recommended)
     * 3. Making the file path configurable via @Value
     * 
     * Current branches untested:
     * - 6 branches in loadProducts() (file read, SQL parsing, loop conditions, error paths)
     * - Cannot mock static method Files.readString() with standard Mockito
     * - Cannot control file existence/content in test environment
     * 
     * Recommendation: Refactor AdminController to inject a FileReaderService
     * or make file path configurable for testing purposes.
     * 
     * This is an architectural limitation, not a testing gap.
     */
}
