package com.groceryapp.backend.service;

import com.groceryapp.backend.dto.AddressRequestDto;
import com.groceryapp.backend.dto.AddressResponseDto;
import com.groceryapp.backend.exception.AddressNotFoundException;
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
        
        // If this is being set as default, unset all other defaults for this user
        if (Boolean.TRUE.equals(requestDto.getIsDefault())) {
            addressRepository.findByUserId(requestDto.getUserId())
                    .forEach(addr -> {
                        addr.setIsDefault(false);
                        addressRepository.save(addr);
                    });
        }
        
        Address address = new Address();
        address.setUserId(requestDto.getUserId());
        address.setFullName(requestDto.getFullName());
        address.setPhoneNumber(requestDto.getPhoneNumber());
        address.setAddressLine1(requestDto.getAddressLine1());
        address.setAddressLine2(requestDto.getAddressLine2());
        address.setCity(requestDto.getCity());
        address.setState(requestDto.getState());
        address.setPincode(requestDto.getPincode());
        address.setAddressType(requestDto.getAddressType());
        address.setIsDefault(requestDto.getIsDefault() != null ? requestDto.getIsDefault() : false);
        
        Address savedAddress = addressRepository.save(address);
        log.info("Address created successfully with ID: {}", savedAddress.getId());
        
        return mapToResponseDto(savedAddress);
    }
    
    @Transactional(readOnly = true)
    public List<AddressResponseDto> getUserAddresses(UUID userId) {
        log.info("Fetching addresses for user: {}", userId);
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public AddressResponseDto getAddressById(UUID addressId) {
        log.info("Fetching address with ID: {}", addressId);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressNotFoundException(addressId));
        return mapToResponseDto(address);
    }
    
    @Transactional
    public AddressResponseDto updateAddress(UUID addressId, AddressRequestDto requestDto) {
        log.info("Updating address with ID: {}", addressId);
        
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressNotFoundException(addressId));
        
        // If this is being set as default, unset all other defaults for this user
        if (Boolean.TRUE.equals(requestDto.getIsDefault()) && !address.getIsDefault()) {
            addressRepository.findByUserId(requestDto.getUserId())
                    .forEach(addr -> {
                        if (!addr.getId().equals(addressId)) {
                            addr.setIsDefault(false);
                            addressRepository.save(addr);
                        }
                    });
        }
        
        address.setFullName(requestDto.getFullName());
        address.setPhoneNumber(requestDto.getPhoneNumber());
        address.setAddressLine1(requestDto.getAddressLine1());
        address.setAddressLine2(requestDto.getAddressLine2());
        address.setCity(requestDto.getCity());
        address.setState(requestDto.getState());
        address.setPincode(requestDto.getPincode());
        address.setAddressType(requestDto.getAddressType());
        address.setIsDefault(requestDto.getIsDefault() != null ? requestDto.getIsDefault() : false);
        
        Address updatedAddress = addressRepository.save(address);
        log.info("Address updated successfully");
        
        return mapToResponseDto(updatedAddress);
    }
    
    @Transactional
    public void deleteAddress(UUID addressId) {
        log.info("Deleting address with ID: {}", addressId);
        
        if (!addressRepository.existsById(addressId)) {
            throw new AddressNotFoundException(addressId);
        }
        
        addressRepository.deleteById(addressId);
        log.info("Address deleted successfully");
    }
    
    @Transactional
    public AddressResponseDto setDefaultAddress(UUID addressId, UUID userId) {
        log.info("Setting address {} as default for user {}", addressId, userId);
        
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressNotFoundException(addressId));
        
        // Unset all other defaults for this user
        addressRepository.findByUserId(userId)
                .forEach(addr -> {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                });
        
        // Set this one as default
        address.setIsDefault(true);
        Address updatedAddress = addressRepository.save(address);
        
        log.info("Default address set successfully");
        return mapToResponseDto(updatedAddress);
    }
    
    private AddressResponseDto mapToResponseDto(Address address) {
        return new AddressResponseDto(
                address.getId(),
                address.getUserId(),
                address.getFullName(),
                address.getPhoneNumber(),
                address.getAddressLine1(),
                address.getAddressLine2(),
                address.getCity(),
                address.getState(),
                address.getPincode(),
                address.getAddressType(),
                address.getIsDefault(),
                address.getCreatedAt(),
                address.getUpdatedAt()
        );
    }
}
