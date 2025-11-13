package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.UpdateProfileRequestDto;
import com.groceryapp.backend.exception.UserAlreadyExistsException;
import com.groceryapp.backend.exception.UserNotFoundException;
import com.groceryapp.backend.model.User;
import com.groceryapp.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private UUID userId;
    private User testUser;
    private UpdateProfileRequestDto updateRequestDto;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        testUser = new User();
        testUser.setId(userId);
        testUser.setEmail("john.doe@example.com");
        testUser.setName("John Doe");
        testUser.setPhoneNumber("1234567890");

        updateRequestDto = new UpdateProfileRequestDto();
        updateRequestDto.setName("Jane Doe");
        updateRequestDto.setPhoneNumber("0987654321");
    }

    @Test
    void getUserById_WithValidId_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserById(userId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(userId);
        assertThat(result.getEmail()).isEqualTo("john.doe@example.com");
        assertThat(result.getName()).isEqualTo("John Doe");
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void getUserById_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(userRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.getUserById(invalidId))
                .isInstanceOf(UserNotFoundException.class);
        verify(userRepository, times(1)).findById(invalidId);
    }

    @Test
    void updateProfile_WithValidData_ShouldUpdateUser() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.updateProfile(userId, updateRequestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(testUser.getName()).isEqualTo("Jane Doe");
        assertThat(testUser.getPhoneNumber()).isEqualTo("0987654321");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateProfile_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(userRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.updateProfile(invalidId, updateRequestDto))
                .isInstanceOf(UserNotFoundException.class);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateProfile_WithExistingEmail_ShouldThrowException() {
        // Arrange
        updateRequestDto.setEmail("existing@example.com");
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> userService.updateProfile(userId, updateRequestDto))
                .isInstanceOf(UserAlreadyExistsException.class);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateProfile_WithSameEmail_ShouldUpdateSuccessfully() {
        // Arrange
        updateRequestDto.setEmail("john.doe@example.com"); // Same as current email
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.updateProfile(userId, updateRequestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(userRepository, never()).existsByEmail(anyString()); // Should not check if same email
        verify(userRepository, times(1)).save(testUser);
    }

    // ========== BRANCH COVERAGE TESTS ==========

    @Test
    void updateProfile_WithNullEmail_ShouldNotCheckEmailExistence() {
        // Tests: requestDto.getEmail() != null branch (NULL case)
        // Arrange
        updateRequestDto.setEmail(null);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateProfile(userId, updateRequestDto);

        // Assert
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, times(1)).save(testUser);
        assertThat(testUser.getEmail()).isEqualTo("john.doe@example.com"); // Email unchanged
    }

    @Test
    void updateProfile_WithNewEmailAvailable_ShouldUpdateEmail() {
        // Tests: new email doesn't exist branch (existsByEmail returns false)
        // Arrange
        String newEmail = "jane.doe@example.com";
        updateRequestDto.setEmail(newEmail);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail(newEmail)).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateProfile(userId, updateRequestDto);

        // Assert
        verify(userRepository, times(1)).existsByEmail(newEmail);
        verify(userRepository, times(1)).save(testUser);
        assertThat(testUser.getEmail()).isEqualTo(newEmail);
    }

    @Test
    void updateProfile_WithNullName_ShouldNotUpdateName() {
        // Tests: requestDto.getName() != null branch (NULL case)
        // Arrange
        String originalName = testUser.getName();
        updateRequestDto.setName(null);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateProfile(userId, updateRequestDto);

        // Assert
        assertThat(testUser.getName()).isEqualTo(originalName); // Name unchanged
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateProfile_WithNonNullName_ShouldUpdateName() {
        // Tests: requestDto.getName() != null branch (NON-NULL case)
        // Arrange
        String newName = "Updated Name";
        updateRequestDto.setName(newName);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateProfile(userId, updateRequestDto);

        // Assert
        assertThat(testUser.getName()).isEqualTo(newName);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateProfile_WithNullPhoneNumber_ShouldNotUpdatePhone() {
        // Tests: requestDto.getPhoneNumber() != null branch (NULL case)
        // Arrange
        String originalPhone = testUser.getPhoneNumber();
        updateRequestDto.setPhoneNumber(null);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateProfile(userId, updateRequestDto);

        // Assert
        assertThat(testUser.getPhoneNumber()).isEqualTo(originalPhone); // Phone unchanged
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateProfile_WithNonNullPhoneNumber_ShouldUpdatePhone() {
        // Tests: requestDto.getPhoneNumber() != null branch (NON-NULL case)
        // Arrange
        String newPhone = "9876543210";
        updateRequestDto.setPhoneNumber(newPhone);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateProfile(userId, updateRequestDto);

        // Assert
        assertThat(testUser.getPhoneNumber()).isEqualTo(newPhone);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateProfile_WithAllNullFields_ShouldOnlySaveWithoutChanges() {
        // Tests: All null branches together
        // Arrange
        String originalEmail = testUser.getEmail();
        String originalName = testUser.getName();
        String originalPhone = testUser.getPhoneNumber();
        
        updateRequestDto.setEmail(null);
        updateRequestDto.setName(null);
        updateRequestDto.setPhoneNumber(null);
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.updateProfile(userId, updateRequestDto);

        // Assert
        assertThat(testUser.getEmail()).isEqualTo(originalEmail);
        assertThat(testUser.getName()).isEqualTo(originalName);
        assertThat(testUser.getPhoneNumber()).isEqualTo(originalPhone);
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, times(1)).save(testUser);
    }
}
