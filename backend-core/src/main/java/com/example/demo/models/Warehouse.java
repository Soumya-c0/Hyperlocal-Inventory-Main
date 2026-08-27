package com.example.demo.models;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Polygon;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long warehouseId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    // This handles the PostGIS GEOMETRY(Polygon, 4326) column
    @Column(columnDefinition = "geometry(Polygon,4326)")
    private Polygon territoryBoundary;

    // Getters and Setters
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Polygon getTerritoryBoundary() { return territoryBoundary; }
    public void setTerritoryBoundary(Polygon territoryBoundary) { this.territoryBoundary = territoryBoundary; }
}