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
@CrossOrigin(origins = "http://localhost:3000")
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressResponseDto> createAddress(@Valid @RequestBody AddressRequestDto requestDto) {
        log.info("REST API: Creating address for user: {}", requestDto.getUserId());
        AddressResponseDto response = addressService.createAddress(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponseDto>> getUserAddresses(@PathVariable UUID userId) {
        log.info("REST API: Getting addresses for user: {}", userId);
        List<AddressResponseDto> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponseDto> getAddressById(@PathVariable UUID id) {
        log.info("REST API: Getting address by ID: {}", id);
        AddressResponseDto response = addressService.getAddressById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDto> updateAddress(
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequestDto requestDto) {
        log.info("REST API: Updating address with ID: {}", id);
        AddressResponseDto response = addressService.updateAddress(id, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable UUID id) {
        log.info("REST API: Deleting address with ID: {}", id);
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/set-default")
    public ResponseEntity<AddressResponseDto> setDefaultAddress(@PathVariable UUID id) {
        log.info("REST API: Setting address as default with ID: {}", id);
        AddressResponseDto response = addressService.setDefaultAddress(id);
        return ResponseEntity.ok(response);
    }
}
