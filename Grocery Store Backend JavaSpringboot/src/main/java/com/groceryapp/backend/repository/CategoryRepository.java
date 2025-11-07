package com.groceryapp.backend.repository;

import com.groceryapp.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    
    List<Category> findByIsActiveTrue();
    
    Optional<Category> findByName(String name);
    
    List<Category> findByNameContainingIgnoreCase(String name);
    
    Optional<Category> findByIdAndIsActiveTrue(UUID id);
}
