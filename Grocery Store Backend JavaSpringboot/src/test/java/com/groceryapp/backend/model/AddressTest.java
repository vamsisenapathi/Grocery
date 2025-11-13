package com.groceryapp.backend.model;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AddressTest {

    @Test
    void testAddressCreation() {
        Address address = new Address();
        address.setId(UUID.randomUUID());
        address.setUserId(UUID.randomUUID());
        address.setFullName("John Doe");
        address.setPhoneNumber("1234567890");
        address.setCity("New York");
        address.setIsDefault(true);

        assertThat(address.getId()).isNotNull();
        assertThat(address.getUserId()).isNotNull();
        assertThat(address.getFullName()).isEqualTo("John Doe");
        assertThat(address.getPhoneNumber()).isEqualTo("1234567890");
        assertThat(address.getCity()).isEqualTo("New York");
        assertThat(address.getIsDefault()).isTrue();
    }

    @Test
    void testAddressWithAllFields() {
        Address address = new Address();
        address.setFullName("Jane Smith");
        address.setPhoneNumber("9876543210");
        address.setAddressLine1("123 Main St");
        address.setAddressLine2("Apt 4B");
        address.setCity("Los Angeles");
        address.setState("CA");
        address.setPincode("90001");
        address.setAddressType("Home");

        assertThat(address.getFullName()).isEqualTo("Jane Smith");
        assertThat(address.getPhoneNumber()).isEqualTo("9876543210");
        assertThat(address.getAddressLine1()).isEqualTo("123 Main St");
        assertThat(address.getAddressLine2()).isEqualTo("Apt 4B");
        assertThat(address.getCity()).isEqualTo("Los Angeles");
        assertThat(address.getState()).isEqualTo("CA");
        assertThat(address.getPincode()).isEqualTo("90001");
        assertThat(address.getAddressType()).isEqualTo("Home");
    }

    @Test
    void testDefaultAddressFlag() {
        Address address1 = new Address();
        address1.setIsDefault(true);

        Address address2 = new Address();
        address2.setIsDefault(false);

        assertThat(address1.getIsDefault()).isTrue();
        assertThat(address2.getIsDefault()).isFalse();
    }

    @Test
    void testAddressType() {
        Address address = new Address();
        address.setAddressType("Home");

        assertThat(address.getAddressType()).isEqualTo("Home");
    }
}
