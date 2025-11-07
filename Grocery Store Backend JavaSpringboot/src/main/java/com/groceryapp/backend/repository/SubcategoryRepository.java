package com.groceryapp.backend.repository;

import com.groceryapp.backend.model.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, UUID> {
    
    List<Subcategory> findByCategoryId(UUID categoryId);
    
    List<Subcategory> findByIsActiveTrue();
    
    Optional<Subcategory> findByName(String name);
    
    List<Subcategory> findByCategoryIdAndIsActiveTrue(UUID categoryId);
}
