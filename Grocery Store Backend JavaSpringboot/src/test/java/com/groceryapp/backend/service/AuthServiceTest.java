package com.groceryapp.backend.service;

import com.groceryapp.backend.config.JwtUtil;
import com.groceryapp.backend.dto.AuthResponseDto;
import com.groceryapp.backend.dto.LoginRequestDto;
import com.groceryapp.backend.dto.RegisterRequestDto;
import com.groceryapp.backend.exception.InvalidCredentialsException;
import com.groceryapp.backend.exception.UserAlreadyExistsException;
import com.groceryapp.backend.model.User;
import com.groceryapp.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Comprehensive test suite for AuthService covering registration and login flows.
 * Tests all branches including success paths, error paths, and edge cases.
 * 
 * Coverage areas:
 * - User registration (success, duplicate email)
 * - User login (success, invalid email, invalid password)
 * - JWT token generation
 * - Password encoding
 * - Data validation
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private RegisterRequestDto validRegisterRequest;
    private LoginRequestDto validLoginRequest;
    private User testUser;
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "Password123!";
    private static final String TEST_NAME = "Test User";
    private static final String TEST_PHONE = "+1234567890";
    private static final String ENCODED_PASSWORD = "$2a$10$encodedPassword";
    private static final String JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

    @BeforeEach
    void setUp() {
        // Setup valid registration request
        validRegisterRequest = new RegisterRequestDto();
        validRegisterRequest.setEmail(TEST_EMAIL);
        validRegisterRequest.setPassword(TEST_PASSWORD);
        validRegisterRequest.setName(TEST_NAME);
        validRegisterRequest.setPhoneNumber(TEST_PHONE);

        // Setup valid login request
        validLoginRequest = new LoginRequestDto();
        validLoginRequest.setEmail(TEST_EMAIL);
        validLoginRequest.setPassword(TEST_PASSWORD);

        // Setup test user
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail(TEST_EMAIL);
        testUser.setPassword(ENCODED_PASSWORD);
        testUser.setName(TEST_NAME);
        testUser.setPhoneNumber(TEST_PHONE);
        testUser.setCreatedAt(Instant.now());
    }

    // ===== REGISTRATION TESTS =====

    @Test
    void whenRegister_withValidData_thenReturnsAuthResponse() {
        // Given
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        AuthResponseDto response = authService.register(validRegisterRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo(JWT_TOKEN);
        assertThat(response.getUserId()).isEqualTo(testUser.getId());
        assertThat(response.getName()).isEqualTo(TEST_NAME);
        assertThat(response.getEmail()).isEqualTo(TEST_EMAIL);
        assertThat(response.getPhoneNumber()).isEqualTo(TEST_PHONE);
        assertThat(response.getMessage()).isEqualTo("Registration successful");
        assertThat(response.getCreatedAt()).isNotNull();
    }

    @Test
    void whenRegister_thenChecksIfUserExists() {
        // Given
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        authService.register(validRegisterRequest);

        // Then
        verify(userRepository).existsByEmail(TEST_EMAIL);
    }

    @Test
    void whenRegister_thenEncodesPassword() {
        // Given
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        authService.register(validRegisterRequest);

        // Then
        verify(passwordEncoder).encode(TEST_PASSWORD);
    }

    @Test
    void whenRegister_thenSavesUserWithCorrectData() {
        // Given
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        authService.register(validRegisterRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        
        assertThat(savedUser.getEmail()).isEqualTo(TEST_EMAIL);
        assertThat(savedUser.getName()).isEqualTo(TEST_NAME);
        assertThat(savedUser.getPhoneNumber()).isEqualTo(TEST_PHONE);
        assertThat(savedUser.getPassword()).isEqualTo(ENCODED_PASSWORD);
    }

    @Test
    void whenRegister_thenGeneratesJwtToken() {
        // Given
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        authService.register(validRegisterRequest);

        // Then
        verify(jwtUtil).generateToken(eq(testUser.getId()), eq(TEST_EMAIL), eq(TEST_NAME));
    }

    @Test
    void whenRegister_withExistingEmail_thenThrowsUserAlreadyExistsException() {
        // Given
        when(userRepository.existsByEmail(TEST_EMAIL)).thenReturn(true);

        // When / Then
        assertThatThrownBy(() -> authService.register(validRegisterRequest))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining(TEST_EMAIL)
                .hasMessageContaining("already exists");

        // Verify password was not encoded and user was not saved
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void whenRegister_withDifferentEmail_thenProcessesSeparately() {
        // Given - First user
        when(userRepository.existsByEmail("user1@example.com")).thenReturn(false);
        when(userRepository.existsByEmail("user2@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        RegisterRequestDto request1 = new RegisterRequestDto();
        request1.setEmail("user1@example.com");
        request1.setPassword("password1");
        request1.setName("User One");
        request1.setPhoneNumber("+111111111");

        RegisterRequestDto request2 = new RegisterRequestDto();
        request2.setEmail("user2@example.com");
        request2.setPassword("password2");
        request2.setName("User Two");
        request2.setPhoneNumber("+222222222");

        // When
        authService.register(request1);
        authService.register(request2);

        // Then
        verify(userRepository).existsByEmail("user1@example.com");
        verify(userRepository).existsByEmail("user2@example.com");
        verify(userRepository, times(2)).save(any(User.class));
    }

    // ===== LOGIN TESTS =====

    @Test
    void whenLogin_withValidCredentials_thenReturnsAuthResponse() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        AuthResponseDto response = authService.login(validLoginRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo(JWT_TOKEN);
        assertThat(response.getUserId()).isEqualTo(testUser.getId());
        assertThat(response.getName()).isEqualTo(TEST_NAME);
        assertThat(response.getEmail()).isEqualTo(TEST_EMAIL);
        assertThat(response.getPhoneNumber()).isEqualTo(TEST_PHONE);
        assertThat(response.getMessage()).isEqualTo("Login successful");
        assertThat(response.getCreatedAt()).isNotNull();
    }

    @Test
    void whenLogin_thenFindsUserByEmail() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        authService.login(validLoginRequest);

        // Then
        verify(userRepository).findByEmail(TEST_EMAIL);
    }

    @Test
    void whenLogin_thenVerifiesPassword() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        authService.login(validLoginRequest);

        // Then
        verify(passwordEncoder).matches(TEST_PASSWORD, ENCODED_PASSWORD);
    }

    @Test
    void whenLogin_thenGeneratesJwtToken() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        authService.login(validLoginRequest);

        // Then
        verify(jwtUtil).generateToken(eq(testUser.getId()), eq(TEST_EMAIL), eq(TEST_NAME));
    }

    @Test
    void whenLogin_withNonExistentEmail_thenThrowsInvalidCredentialsException() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

        // When / Then
        assertThatThrownBy(() -> authService.login(validLoginRequest))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid email or password");

        // Verify password was not checked and token was not generated
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(any(UUID.class), anyString(), anyString());
    }

    @Test
    void whenLogin_withInvalidPassword_thenThrowsInvalidCredentialsException() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(false);

        // When / Then
        assertThatThrownBy(() -> authService.login(validLoginRequest))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Invalid email or password");

        // Verify token was not generated
        verify(jwtUtil, never()).generateToken(any(UUID.class), anyString(), anyString());
    }

    @Test
    void whenLogin_withWrongPassword_thenPasswordCheckFails() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("WrongPassword123!", ENCODED_PASSWORD)).thenReturn(false);

        LoginRequestDto wrongPasswordRequest = new LoginRequestDto();
        wrongPasswordRequest.setEmail(TEST_EMAIL);
        wrongPasswordRequest.setPassword("WrongPassword123!");

        // When / Then
        assertThatThrownBy(() -> authService.login(wrongPasswordRequest))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(passwordEncoder).matches("WrongPassword123!", ENCODED_PASSWORD);
    }

    @Test
    void whenLogin_multipleAttempts_thenEachIsValidatedIndependently() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When - Multiple successful logins
        authService.login(validLoginRequest);
        authService.login(validLoginRequest);
        authService.login(validLoginRequest);

        // Then
        verify(userRepository, times(3)).findByEmail(TEST_EMAIL);
        verify(passwordEncoder, times(3)).matches(TEST_PASSWORD, ENCODED_PASSWORD);
        verify(jwtUtil, times(3)).generateToken(any(UUID.class), anyString(), anyString());
    }

    @Test
    void whenLogin_withSpecialCharactersInEmail_thenHandlesCorrectly() {
        // Given
        String specialEmail = "test+special@example-domain.co.uk";
        User specialUser = new User();
        specialUser.setId(UUID.randomUUID());
        specialUser.setEmail(specialEmail);
        specialUser.setPassword(ENCODED_PASSWORD);
        specialUser.setName("Special User");
        specialUser.setPhoneNumber("+999999999");
        specialUser.setCreatedAt(Instant.now());

        LoginRequestDto specialRequest = new LoginRequestDto();
        specialRequest.setEmail(specialEmail);
        specialRequest.setPassword(TEST_PASSWORD);

        when(userRepository.findByEmail(specialEmail)).thenReturn(Optional.of(specialUser));
        when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(jwtUtil.generateToken(any(UUID.class), anyString(), anyString())).thenReturn(JWT_TOKEN);

        // When
        AuthResponseDto response = authService.login(specialRequest);

        // Then
        assertThat(response.getEmail()).isEqualTo(specialEmail);
        verify(userRepository).findByEmail(specialEmail);
    }
}
