package com.example.demo.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_ledger")
public class CarbonLedger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ledgerId;

    @OneToOne
    @JoinColumn(name = "order_id")
    private ActiveOrder activeOrder;

    @Column(name = "original_route_co2_grams", precision = 8, scale = 2)
    private BigDecimal originalRouteCo2Grams;

    @Column(name = "optimized_route_co2_grams", precision = 8, scale = 2)
    private BigDecimal optimizedRouteCo2Grams;

    @Column(name = "carbon_saved_grams", insertable = false, updatable = false)
    private BigDecimal carbonSavedGrams;

    @Column(name = "recorded_at", insertable = false, updatable = false)
    private LocalDateTime recordedAt;

    public Long getLedgerId() { return ledgerId; }
    public void setLedgerId(Long ledgerId) { this.ledgerId = ledgerId; }
    public ActiveOrder getActiveOrder() { return activeOrder; }
    public void setActiveOrder(ActiveOrder activeOrder) { this.activeOrder = activeOrder; }
    public BigDecimal getOriginalRouteCo2Grams() { return originalRouteCo2Grams; }
    public void setOriginalRouteCo2Grams(BigDecimal originalRouteCo2Grams) { this.originalRouteCo2Grams = originalRouteCo2Grams; }
    public BigDecimal getOptimizedRouteCo2Grams() { return optimizedRouteCo2Grams; }
    public void setOptimizedRouteCo2Grams(BigDecimal optimizedRouteCo2Grams) { this.optimizedRouteCo2Grams = optimizedRouteCo2Grams; }
    public BigDecimal getCarbonSavedGrams() { return carbonSavedGrams; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
}
