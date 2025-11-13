package com.groceryapp.backend.model;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    @Test
    void testUserCreation() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setPassword("securePassword123");

        assertThat(user.getId()).isNotNull();
        assertThat(user.getName()).isEqualTo("John Doe");
        assertThat(user.getEmail()).isEqualTo("john@example.com");
        assertThat(user.getPassword()).isEqualTo("securePassword123");
    }

    @Test
    void testUserWithTimestamps() {
        User user = new User();
        user.setName("Jane Smith");
        user.setEmail("jane@example.com");
        user.setPhoneNumber("9876543210");

        assertThat(user.getPhoneNumber()).isEqualTo("9876543210");
    }

    @Test
    void testAllArgsConstructor() {
        UUID id = UUID.randomUUID();
        String name = "Test User";
        String email = "test@example.com";
        String password = "password";

        User user = new User(id, name, email, password, null, null, null);

        assertThat(user.getId()).isEqualTo(id);
        assertThat(user.getName()).isEqualTo(name);
        assertThat(user.getEmail()).isEqualTo(email);
        assertThat(user.getPassword()).isEqualTo(password);
    }
}
