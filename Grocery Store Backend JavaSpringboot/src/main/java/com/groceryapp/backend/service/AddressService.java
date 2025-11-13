package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.AddressRequestDto;
import com.groceryapp.backend.dto.AddressResponseDto;
import com.groceryapp.backend.exception.ResourceNotFoundException;
import com.groceryapp.backend.model.Address;
import com.groceryapp.backend.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressService {

    private final AddressRepository addressRepository;

    @Transactional
    public AddressResponseDto createAddress(AddressRequestDto requestDto) {
        log.info("Creating new address for user: {}", requestDto.getUserId());
        
        // If this is set as default, reset all other addresses
        if (Boolean.TRUE.equals(requestDto.getIsDefault())) {
            addressRepository.resetDefaultAddresses(requestDto.getUserId());
        }

        Address address = Address.builder()
                .userId(requestDto.getUserId())
                .fullName(requestDto.getFullName())
                .phoneNumber(requestDto.getPhoneNumber())
                .addressLine1(requestDto.getAddressLine1())
                .addressLine2(requestDto.getAddressLine2())
                .city(requestDto.getCity())
                .state(requestDto.getState())
                .pincode(requestDto.getPincode())
                .latitude(requestDto.getLatitude())
                .longitude(requestDto.getLongitude())
                .addressType(requestDto.getAddressType())
                .isDefault(requestDto.getIsDefault())
                .build();

        Address savedAddress = addressRepository.save(address);
        log.info("Address created successfully with ID: {}", savedAddress.getId());
        
        return mapToResponseDto(savedAddress);
    }

    @Transactional(readOnly = true)
    public List<AddressResponseDto> getUserAddresses(UUID userId) {
        log.info("Fetching addresses for user: {}", userId);
        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
        log.info("Found {} addresses for user: {}", addresses.size(), userId);
        
        return addresses.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AddressResponseDto getAddressById(UUID id) {
        log.info("Fetching address with ID: {}", id);
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + id));
        
        return mapToResponseDto(address);
    }

    @Transactional
    public AddressResponseDto updateAddress(UUID id, AddressRequestDto requestDto) {
        log.info("Updating address with ID: {}", id);
        
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + id));

        // If this is being set as default, reset all other addresses
        if (Boolean.TRUE.equals(requestDto.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.resetDefaultAddresses(address.getUserId());
        }

        address.setFullName(requestDto.getFullName());
        address.setPhoneNumber(requestDto.getPhoneNumber());
        address.setAddressLine1(requestDto.getAddressLine1());
        address.setAddressLine2(requestDto.getAddressLine2());
        address.setCity(requestDto.getCity());
        address.setState(requestDto.getState());
        address.setPincode(requestDto.getPincode());
        address.setLatitude(requestDto.getLatitude());
        address.setLongitude(requestDto.getLongitude());
        address.setAddressType(requestDto.getAddressType());
        address.setIsDefault(requestDto.getIsDefault());

        Address updatedAddress = addressRepository.save(address);
        log.info("Address updated successfully with ID: {}", updatedAddress.getId());
        
        return mapToResponseDto(updatedAddress);
    }

    @Transactional
    public void deleteAddress(UUID id) {
        log.info("Deleting address with ID: {}", id);
        
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + id));

        addressRepository.delete(address);
        log.info("Address deleted successfully with ID: {}", id);
    }

    @Transactional
    public AddressResponseDto setDefaultAddress(UUID id) {
        log.info("Setting address as default with ID: {}", id);
        
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + id));

        // Reset all other addresses for this user
        addressRepository.resetDefaultAddresses(address.getUserId());

        // Set this address as default
        address.setIsDefault(true);
        Address updatedAddress = addressRepository.save(address);
        
        log.info("Address set as default successfully with ID: {}", id);
        return mapToResponseDto(updatedAddress);
    }

    private AddressResponseDto mapToResponseDto(Address address) {
        return AddressResponseDto.builder()
                .id(address.getId())
                .userId(address.getUserId())
                .fullName(address.getFullName())
                .phoneNumber(address.getPhoneNumber())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .addressType(address.getAddressType())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }
}
