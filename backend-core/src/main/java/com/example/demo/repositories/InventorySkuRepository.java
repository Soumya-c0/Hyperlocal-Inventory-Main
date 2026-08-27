package com.example.demo.repositories;

import com.example.demo.models.InventorySku;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventorySkuRepository extends JpaRepository<InventorySku, Long> {
}