package com.groceryapp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/geolocation")
@CrossOrigin(origins = "*")
public class GeolocationController {

    @GetMapping("/reverse-geocode")
    public ResponseEntity<Map<String, Object>> reverseGeocode(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude) {
        
        // Handle missing parameters
        if (latitude == null || longitude == null) {
            System.err.println("Missing latitude or longitude parameters");
            return ResponseEntity.ok(getDefaultAddress(
                latitude != null ? latitude : 0.0,
                longitude != null ? longitude : 0.0
            ));
        }
        
        try {
            // Configure RestTemplate with timeout
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(5000); // 5 seconds
            factory.setReadTimeout(5000); // 5 seconds
            RestTemplate restTemplate = new RestTemplate(factory);
            
            // Use OpenStreetMap Nominatim API for reverse geocoding
            String url = String.format(
                "https://nominatim.openstreetmap.org/reverse?format=json&lat=%f&lon=%f&zoom=18&addressdetails=1",
                latitude, longitude
            );
            
            // Add User-Agent header as required by Nominatim
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "GroceryStoreApp/1.0");
            headers.set("Accept-Language", "en");
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                Map.class
            ).getBody();
            
            if (response != null && response.containsKey("address")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> address = (Map<String, Object>) response.get("address");
                
                Map<String, Object> result = new HashMap<>();
                result.put("addressLine1", extractAddressLine1(address));
                result.put("addressLine2", extractAddressLine2(address));
                result.put("city", extractCity(address));
                result.put("state", extractState(address));
                result.put("pincode", extractPincode(address));
                result.put("latitude", latitude);
                result.put("longitude", longitude);
                
                return ResponseEntity.ok(result);
            }
            
            // Return default address if no address found
            System.out.println("No address found in Nominatim response, returning defaults");
            return ResponseEntity.ok(getDefaultAddress(latitude, longitude));
            
        } catch (RestClientException e) {
            System.err.println("Geocoding API error: " + e.getMessage());
            e.printStackTrace();
            // Return default address instead of error
            return ResponseEntity.ok(getDefaultAddress(latitude, longitude));
        } catch (Exception e) {
            System.err.println("Unexpected error in reverse geocoding: " + e.getMessage());
            e.printStackTrace();
            // Return default address instead of error
            return ResponseEntity.ok(getDefaultAddress(latitude, longitude));
        }
    }

    private String extractAddressLine1(Map<String, Object> address) {
        StringBuilder line1 = new StringBuilder();
        
        if (address.containsKey("house_number")) {
            line1.append(address.get("house_number")).append(" ");
        }
        if (address.containsKey("road")) {
            line1.append(address.get("road"));
        } else if (address.containsKey("street")) {
            line1.append(address.get("street"));
        }
        
        return line1.length() > 0 ? line1.toString().trim() : "Address Line 1";
    }

    private String extractAddressLine2(Map<String, Object> address) {
        if (address.containsKey("suburb")) {
            return (String) address.get("suburb");
        } else if (address.containsKey("neighbourhood")) {
            return (String) address.get("neighbourhood");
        }
        return "";
    }

    private String extractCity(Map<String, Object> address) {
        if (address.containsKey("city")) {
            return (String) address.get("city");
        } else if (address.containsKey("town")) {
            return (String) address.get("town");
        } else if (address.containsKey("village")) {
            return (String) address.get("village");
        } else if (address.containsKey("municipality")) {
            return (String) address.get("municipality");
        }
        return "City";
    }

    private String extractState(Map<String, Object> address) {
        if (address.containsKey("state")) {
            return (String) address.get("state");
        } else if (address.containsKey("region")) {
            return (String) address.get("region");
        }
        return "State";
    }

    private String extractPincode(Map<String, Object> address) {
        if (address.containsKey("postcode")) {
            return (String) address.get("postcode");
        }
        return "000000";
    }

    private Map<String, Object> getDefaultAddress(Double latitude, Double longitude) {
        Map<String, Object> result = new HashMap<>();
        result.put("addressLine1", "");
        result.put("addressLine2", "");
        result.put("city", "");
        result.put("state", "");
        result.put("pincode", "");
        result.put("latitude", latitude);
        result.put("longitude", longitude);
        return result;
    }
}
