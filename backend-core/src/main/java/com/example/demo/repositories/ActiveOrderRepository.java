package com.example.demo.repositories;

import com.example.demo.models.ActiveOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActiveOrderRepository extends JpaRepository<ActiveOrder, Long> {
}