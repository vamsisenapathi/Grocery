package com.groceryapp.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groceryapp.backend.dto.AddressRequestDto;
import com.groceryapp.backend.dto.AddressResponseDto;
import com.groceryapp.backend.service.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AddressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AddressService addressService;

    private AddressRequestDto addressRequest;
    private AddressResponseDto addressResponse;
    private UUID addressId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        addressId = UUID.randomUUID();
        userId = UUID.randomUUID();

        addressRequest = new AddressRequestDto();
        addressRequest.setUserId(userId);
        addressRequest.setFullName("John Doe");
        addressRequest.setPhoneNumber("9876543210");
        addressRequest.setAddressLine1("123 Main St");
        addressRequest.setCity("Mumbai");
        addressRequest.setState("Maharashtra");
        addressRequest.setPincode("400001");
        addressRequest.setAddressType("home");
        addressRequest.setIsDefault(false);

        addressResponse = new AddressResponseDto();
        addressResponse.setId(addressId);
        addressResponse.setUserId(userId);
        addressResponse.setFullName("John Doe");
        addressResponse.setPhoneNumber("9876543210");
        addressResponse.setAddressLine1("123 Main St");
        addressResponse.setCity("Mumbai");
        addressResponse.setState("Maharashtra");
        addressResponse.setPincode("400001");
        addressResponse.setAddressType("home");
        addressResponse.setIsDefault(false);
    }

    @Test
    void createAddress_WithValidData_ShouldReturnCreated() throws Exception {
        when(addressService.createAddress(any(AddressRequestDto.class))).thenReturn(addressResponse);

        mockMvc.perform(post("/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fullName").value("John Doe"))
                .andExpect(jsonPath("$.city").value("Mumbai"));

        verify(addressService, times(1)).createAddress(any(AddressRequestDto.class));
    }

    @Test
    void getUserAddresses_WithValidUserId_ShouldReturnAddresses() throws Exception {
        List<AddressResponseDto> addresses = Arrays.asList(addressResponse);
        when(addressService.getUserAddresses(userId)).thenReturn(addresses);

        mockMvc.perform(get("/addresses/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("John Doe"));

        verify(addressService, times(1)).getUserAddresses(userId);
    }

    @Test
    void getAddressById_WithValidId_ShouldReturnAddress() throws Exception {
        when(addressService.getAddressById(addressId)).thenReturn(addressResponse);

        mockMvc.perform(get("/addresses/{id}", addressId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(addressId.toString()))
                .andExpect(jsonPath("$.fullName").value("John Doe"));

        verify(addressService, times(1)).getAddressById(addressId);
    }

    @Test
    void updateAddress_WithValidData_ShouldReturnUpdatedAddress() throws Exception {
        when(addressService.updateAddress(eq(addressId), any(AddressRequestDto.class))).thenReturn(addressResponse);

        mockMvc.perform(put("/addresses/{id}", addressId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("John Doe"));

        verify(addressService, times(1)).updateAddress(eq(addressId), any(AddressRequestDto.class));
    }

    @Test
    void deleteAddress_WithValidId_ShouldReturnNoContent() throws Exception {
        doNothing().when(addressService).deleteAddress(addressId);

        mockMvc.perform(delete("/addresses/{id}", addressId))
                .andExpect(status().isNoContent());

        verify(addressService, times(1)).deleteAddress(addressId);
    }

    @Test
    void setDefaultAddress_WithValidId_ShouldReturnUpdatedAddress() throws Exception {
        AddressResponseDto defaultAddress = new AddressResponseDto();
        defaultAddress.setId(addressId);
        defaultAddress.setIsDefault(true);

        when(addressService.setDefaultAddress(addressId)).thenReturn(defaultAddress);

        mockMvc.perform(patch("/addresses/{id}/set-default", addressId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isDefault").value(true));

        verify(addressService, times(1)).setDefaultAddress(addressId);
    }
}
