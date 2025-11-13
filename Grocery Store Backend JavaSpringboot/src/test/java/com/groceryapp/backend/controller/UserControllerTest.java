package com.groceryapp.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groceryapp.backend.dto.UpdateProfileRequestDto;
import com.groceryapp.backend.model.User;
import com.groceryapp.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private User user;
    private UpdateProfileRequestDto updateRequest;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        user = new User();
        user.setId(userId);
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setPhoneNumber("+919876543210");

        updateRequest = new UpdateProfileRequestDto();
        updateRequest.setName("John Updated");
        updateRequest.setPhoneNumber("+919876543211");
    }

    @Test
    void getUserProfile_WithValidId_ShouldReturnUser() throws Exception {
        when(userService.getUserById(userId)).thenReturn(user);

        mockMvc.perform(get("/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userId.toString()))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"));

        verify(userService, times(1)).getUserById(userId);
    }

    @Test
    void updateUserProfile_WithValidData_ShouldReturnUpdatedUser() throws Exception {
        User updatedUser = new User();
        updatedUser.setId(userId);
        updatedUser.setName("John Updated");
        updatedUser.setEmail("john@example.com");
        updatedUser.setPhoneNumber("+919876543211");

        when(userService.updateProfile(eq(userId), any(UpdateProfileRequestDto.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Updated"))
                .andExpect(jsonPath("$.phoneNumber").value("+919876543211"));

        verify(userService, times(1)).updateProfile(eq(userId), any(UpdateProfileRequestDto.class));
    }
}
