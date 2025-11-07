package com.groceryapp.backend.controller;

import com.groceryapp.backend.dto.AddressRequestDto;
import com.groceryapp.backend.dto.AddressResponseDto;
import com.groceryapp.backend.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AddressController {
    
    private final AddressService addressService;
    
    @PostMapping
    public ResponseEntity<AddressResponseDto> createAddress(@Valid @RequestBody AddressRequestDto requestDto) {
        log.info("Received request to create address for user: {}", requestDto.getUserId());
        AddressResponseDto address = addressService.createAddress(requestDto);
        return new ResponseEntity<>(address, HttpStatus.CREATED);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponseDto>> getUserAddresses(@PathVariable UUID userId) {
        log.info("Received request to get addresses for user: {}", userId);
        List<AddressResponseDto> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AddressResponseDto> getAddressById(@PathVariable UUID id) {
        log.info("Received request to get address with ID: {}", id);
        AddressResponseDto address = addressService.getAddressById(id);
        return ResponseEntity.ok(address);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDto> updateAddress(
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequestDto requestDto) {
        log.info("Received request to update address with ID: {}", id);
        AddressResponseDto address = addressService.updateAddress(id, requestDto);
        return ResponseEntity.ok(address);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable UUID id) {
        log.info("Received request to delete address with ID: {}", id);
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/set-default")
    public ResponseEntity<AddressResponseDto> setDefaultAddress(
            @PathVariable UUID id,
            @RequestParam UUID userId) {
        log.info("Received request to set address {} as default for user {}", id, userId);
        AddressResponseDto address = addressService.setDefaultAddress(id, userId);
        return ResponseEntity.ok(address);
    }
}
