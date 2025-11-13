package com.groceryapp.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MissingServletRequestParameterException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice(assignableTypes = GeolocationController.class)
public class GeolocationControllerAdvice {

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, Object>> handleMissingParams(MissingServletRequestParameterException ex) {
        Map<String, Object> result = new HashMap<>();
        result.put("addressLine1", "");
        result.put("addressLine2", "");
        result.put("city", "");
        result.put("state", "");
        result.put("pincode", "");
        result.put("latitude", 0.0);
        result.put("longitude", 0.0);
        result.put("error", "Missing required parameters: " + ex.getParameterName());
        return ResponseEntity.ok(result);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        System.err.println("Unhandled exception in GeolocationController: " + ex.getMessage());
        ex.printStackTrace();
        
        Map<String, Object> result = new HashMap<>();
        result.put("addressLine1", "");
        result.put("addressLine2", "");
        result.put("city", "");
        result.put("state", "");
        result.put("pincode", "");
        result.put("latitude", 0.0);
        result.put("longitude", 0.0);
        return ResponseEntity.ok(result);
    }
}
