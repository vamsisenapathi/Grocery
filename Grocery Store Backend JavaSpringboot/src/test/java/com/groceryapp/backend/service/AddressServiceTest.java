package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.AddressRequestDto;
import com.groceryapp.backend.dto.AddressResponseDto;
import com.groceryapp.backend.exception.ResourceNotFoundException;
import com.groceryapp.backend.model.Address;
import com.groceryapp.backend.repository.AddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddressServiceTest {

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private AddressService addressService;

    private UUID userId;
    private UUID addressId;
    private Address testAddress;
    private AddressRequestDto requestDto;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        addressId = UUID.randomUUID();

        testAddress = new Address();
        testAddress.setId(addressId);
        testAddress.setUserId(userId);
        testAddress.setFullName("John Doe");
        testAddress.setPhoneNumber("1234567890");
        testAddress.setAddressLine1("123 Main St");
        testAddress.setAddressLine2("Apt 4B");
        testAddress.setCity("New York");
        testAddress.setState("NY");
        testAddress.setPincode("10001");
        testAddress.setIsDefault(false);

        requestDto = new AddressRequestDto();
        requestDto.setUserId(userId);
        requestDto.setFullName("John Doe");
        requestDto.setPhoneNumber("1234567890");
        requestDto.setAddressLine1("123 Main St");
        requestDto.setAddressLine2("Apt 4B");
        requestDto.setCity("New York");
        requestDto.setState("NY");
        requestDto.setPincode("10001");
        requestDto.setIsDefault(false);
    }

    @Test
    void createAddress_WithValidData_ShouldCreateAddress() {
        // Arrange
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.createAddress(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getFullName()).isEqualTo("John Doe");
        assertThat(result.getCity()).isEqualTo("New York");
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    void createAddress_AsDefault_ShouldUnsetOtherDefaults() {
        // Arrange
        requestDto.setIsDefault(true);
        testAddress.setIsDefault(true);
        
        doNothing().when(addressRepository).resetDefaultAddresses(userId);
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.createAddress(requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getIsDefault()).isTrue();
        verify(addressRepository, times(1)).resetDefaultAddresses(userId);
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    void getUserAddresses_ShouldReturnAllUserAddresses() {
        // Arrange
        List<Address> addresses = Arrays.asList(testAddress);
        when(addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)).thenReturn(addresses);

        // Act
        List<AddressResponseDto> result = addressService.getUserAddresses(userId);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFullName()).isEqualTo("John Doe");
        verify(addressRepository, times(1)).findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
    }

    @Test
    void getUserAddresses_WhenNoAddresses_ShouldReturnEmptyList() {
        // Arrange
        when(addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)).thenReturn(Collections.emptyList());

        // Act
        List<AddressResponseDto> result = addressService.getUserAddresses(userId);

        // Assert
        assertThat(result).isEmpty();
        verify(addressRepository, times(1)).findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
    }

    @Test
    void getAddressById_WithValidId_ShouldReturnAddress() {
        // Arrange
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));

        // Act
        AddressResponseDto result = addressService.getAddressById(addressId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(addressId);
        verify(addressRepository, times(1)).findById(addressId);
    }

    @Test
    void getAddressById_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(addressRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> addressService.getAddressById(invalidId))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(addressRepository, times(1)).findById(invalidId);
    }

    @Test
    void updateAddress_WithValidData_ShouldUpdateAddress() {
        // Arrange
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        requestDto.setCity("Boston");

        // Act
        AddressResponseDto result = addressService.updateAddress(addressId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        assertThat(testAddress.getCity()).isEqualTo("Boston");
        verify(addressRepository, times(1)).save(testAddress);
    }

    @Test
    void updateAddress_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(addressRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> addressService.updateAddress(invalidId, requestDto))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(addressRepository, never()).save(any(Address.class));
    }

    @Test
    void deleteAddress_WithValidId_ShouldDeleteAddress() {
        // Arrange
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        doNothing().when(addressRepository).delete(testAddress);

        // Act
        addressService.deleteAddress(addressId);

        // Assert
        verify(addressRepository, times(1)).delete(testAddress);
    }

    @Test
    void deleteAddress_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(addressRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> addressService.deleteAddress(invalidId))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(addressRepository, never()).delete(any(Address.class));
    }

    @Test
    void setDefaultAddress_ShouldSetAddressAsDefault() {
        // Arrange
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        doNothing().when(addressRepository).resetDefaultAddresses(userId);
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.setDefaultAddress(addressId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(testAddress.getIsDefault()).isTrue();
        verify(addressRepository, times(1)).resetDefaultAddresses(userId);
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    void setDefaultAddress_WithInvalidId_ShouldThrowException() {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(addressRepository.findById(invalidId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> addressService.setDefaultAddress(invalidId))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(addressRepository, never()).save(any(Address.class));
    }

    // ==================== ADDITIONAL BRANCH COVERAGE TESTS ====================

    @Test
    void createAddress_WithIsDefaultTrue_ShouldResetOtherAddresses() {
        // Arrange
        requestDto.setIsDefault(true);
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.createAddress(requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(addressRepository, times(1)).resetDefaultAddresses(requestDto.getUserId());
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    void createAddress_WithIsDefaultFalse_ShouldNotResetOtherAddresses() {
        // Arrange
        requestDto.setIsDefault(false);
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.createAddress(requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(addressRepository, never()).resetDefaultAddresses(any());
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    void createAddress_WithIsDefaultNull_ShouldNotResetOtherAddresses() {
        // Arrange
        requestDto.setIsDefault(null);
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.createAddress(requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(addressRepository, never()).resetDefaultAddresses(any());
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    void updateAddress_WhenChangingToDefault_ShouldResetOtherAddresses() {
        // Arrange
        testAddress.setIsDefault(false); // Currently not default
        requestDto.setIsDefault(true);   // Changing to default
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.updateAddress(addressId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(addressRepository, times(1)).resetDefaultAddresses(testAddress.getUserId());
        verify(addressRepository, times(1)).save(testAddress);
    }

    @Test
    void updateAddress_WhenAlreadyDefault_ShouldNotResetOtherAddresses() {
        // Arrange
        testAddress.setIsDefault(true); // Already default
        requestDto.setIsDefault(true);  // Staying default
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.updateAddress(addressId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(addressRepository, never()).resetDefaultAddresses(any());
        verify(addressRepository, times(1)).save(testAddress);
    }

    @Test
    void updateAddress_WhenNotChangingToDefault_ShouldNotResetOtherAddresses() {
        // Arrange
        testAddress.setIsDefault(false); // Not default
        requestDto.setIsDefault(false);  // Staying not default
        when(addressRepository.findById(addressId)).thenReturn(Optional.of(testAddress));
        when(addressRepository.save(any(Address.class))).thenReturn(testAddress);

        // Act
        AddressResponseDto result = addressService.updateAddress(addressId, requestDto);

        // Assert
        assertThat(result).isNotNull();
        verify(addressRepository, never()).resetDefaultAddresses(any());
        verify(addressRepository, times(1)).save(testAddress);
    }
}

