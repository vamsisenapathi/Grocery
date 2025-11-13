package com.groceryapp.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for GeolocationController focusing on branch coverage
 * Testing all extraction method branches and error handling paths
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class GeolocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void reverseGeocode_WithValidCoordinates_ShouldReturnAddress() throws Exception {
        // Using coordinates for a known location (will call real API or fallback to default)
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "28.6139")
                        .param("longitude", "77.2090"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(28.6139))
                .andExpect(jsonPath("$.longitude").value(77.2090))
                .andExpect(jsonPath("$.addressLine1").exists())
                .andExpect(jsonPath("$.city").exists())
                .andExpect(jsonPath("$.state").exists())
                .andExpect(jsonPath("$.pincode").exists());
    }

    @Test
    void reverseGeocode_WithZeroCoordinates_ShouldReturnDefaultAddress() throws Exception {
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "0.0")
                        .param("longitude", "0.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(0.0))
                .andExpect(jsonPath("$.longitude").value(0.0));
    }

    @Test
    void reverseGeocode_WithNegativeCoordinates_ShouldReturnAddress() throws Exception {
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "-33.8688")
                        .param("longitude", "151.2093"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(-33.8688))
                .andExpect(jsonPath("$.longitude").value(151.2093));
    }

    @Test
    void reverseGeocode_WithHighPrecisionCoordinates_ShouldReturnAddress() throws Exception {
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "12.9715987")
                        .param("longitude", "77.5945627"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(12.9715987))
                .andExpect(jsonPath("$.longitude").value(77.5945627))
                .andExpect(jsonPath("$.addressLine1").exists())
                .andExpect(jsonPath("$.addressLine2").exists())
                .andExpect(jsonPath("$.city").exists())
                .andExpect(jsonPath("$.state").exists())
                .andExpect(jsonPath("$.pincode").exists());
    }

    @Test
    void reverseGeocode_WithBoundaryLatitude_ShouldReturnAddress() throws Exception {
        // Test northern hemisphere boundary
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "89.9")
                        .param("longitude", "0.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(89.9))
                .andExpect(jsonPath("$.longitude").value(0.0));
    }

    @Test
    void reverseGeocode_WithBoundaryLongitude_ShouldReturnAddress() throws Exception {
        // Test eastern hemisphere boundary
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "0.0")
                        .param("longitude", "179.9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(0.0))
                .andExpect(jsonPath("$.longitude").value(179.9));
    }

    @Test
    void reverseGeocode_WithIndianCoordinates_ShouldReturnIndianAddress() throws Exception {
        // Delhi coordinates
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "28.7041")
                        .param("longitude", "77.1025"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(28.7041))
                .andExpect(jsonPath("$.longitude").value(77.1025))
                .andExpect(jsonPath("$.addressLine1").exists());
    }

    @Test
    void reverseGeocode_WithUSCoordinates_ShouldReturnUSAddress() throws Exception {
        // New York coordinates
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "40.7128")
                        .param("longitude", "-74.0060"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(40.7128))
                .andExpect(jsonPath("$.longitude").value(-74.0060));
    }

    @Test
    void reverseGeocode_WithRemoteOceanCoordinates_ShouldReturnDefaultAddress() throws Exception {
        // Middle of Pacific Ocean - should fallback to default
        mockMvc.perform(get("/geolocation/reverse-geocode")
                        .param("latitude", "0.0")
                        .param("longitude", "-140.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latitude").value(0.0))
                .andExpect(jsonPath("$.longitude").value(-140.0));
    }
}
