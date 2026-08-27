package com.example.demo.repositories;

import com.example.demo.models.CarbonLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarbonLedgerRepository extends JpaRepository<CarbonLedger, Long> {
}