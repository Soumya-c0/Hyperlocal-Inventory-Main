package com.example.demo.models;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;

@Entity
@Table(name = "active_orders")
public class ActiveOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "sku_id")
    private InventorySku inventorySku;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point deliveryLocation;

    @Column(length = 20)
    private String status = "PENDING";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Standard Getters / Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public InventorySku getInventorySku() { return inventorySku; }
    public void setInventorySku(InventorySku inventorySku) { this.inventorySku = inventorySku; }
    public Point getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(Point deliveryLocation) { this.deliveryLocation = deliveryLocation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}