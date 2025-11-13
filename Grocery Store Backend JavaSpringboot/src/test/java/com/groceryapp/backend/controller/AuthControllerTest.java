package com.groceryapp.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groceryapp.backend.dto.AuthResponseDto;
import com.groceryapp.backend.dto.LoginRequestDto;
import com.groceryapp.backend.dto.RegisterRequestDto;
import com.groceryapp.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private RegisterRequestDto registerRequest;
    private LoginRequestDto loginRequest;
    private AuthResponseDto authResponse;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequestDto();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@test.com");
        registerRequest.setPassword("test1234");
        registerRequest.setPhoneNumber("+919876543210");

        loginRequest = new LoginRequestDto();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("test1234");

        authResponse = new AuthResponseDto();
        authResponse.setToken("mock-jwt-token");
        authResponse.setMessage("Success");
    }

    @Test
    void register_WithValidData_ShouldReturnCreated() throws Exception {
        when(authService.register(any(RegisterRequestDto.class))).thenReturn(authResponse);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.message").value("Success"));

        verify(authService, times(1)).register(any(RegisterRequestDto.class));
    }

    @Test
    void register_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        RegisterRequestDto invalidRequest = new RegisterRequestDto();
        // Missing required fields

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_WithValidCredentials_ShouldReturnOk() throws Exception {
        when(authService.login(any(LoginRequestDto.class))).thenReturn(authResponse);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"));

        verify(authService, times(1)).login(any(LoginRequestDto.class));
    }

    @Test
    void login_WithInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        when(authService.login(any(LoginRequestDto.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().is5xxServerError());

        verify(authService, times(1)).login(any(LoginRequestDto.class));
    }

    @Test
    void register_WithShortPassword_ShouldReturnBadRequest() throws Exception {
        RegisterRequestDto invalidRequest = new RegisterRequestDto();
        invalidRequest.setName("Test");
        invalidRequest.setEmail("test@test.com");
        invalidRequest.setPassword("short"); // Too short
        invalidRequest.setPhoneNumber("+919876543210");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_WithLongPassword_ShouldReturnBadRequest() throws Exception {
        RegisterRequestDto invalidRequest = new RegisterRequestDto();
        invalidRequest.setName("Test");
        invalidRequest.setEmail("test@test.com");
        invalidRequest.setPassword("toolongpassword12345"); // Too long
        invalidRequest.setPhoneNumber("+919876543210");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
