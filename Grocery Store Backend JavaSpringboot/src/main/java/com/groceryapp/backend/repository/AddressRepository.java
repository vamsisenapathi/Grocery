package com.groceryapp.backend.repository;

import com.groceryapp.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
    
    List<Address> findByUserIdOrderByIsDefaultDescCreatedAtDesc(UUID userId);
    
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.userId = :userId")
    void resetDefaultAddresses(@Param("userId") UUID userId);
}
