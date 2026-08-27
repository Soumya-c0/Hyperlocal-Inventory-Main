package com.example.demo.services;

import com.example.demo.models.ActiveOrder;
import com.example.demo.models.InventorySku;
import com.example.demo.repositories.ActiveOrderRepository;
import com.example.demo.repositories.InventorySkuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final ActiveOrderRepository orderRepo;
    private final InventorySkuRepository skuRepo;

    public OrderService(ActiveOrderRepository orderRepo, InventorySkuRepository skuRepo) {
        this.orderRepo = orderRepo;
        this.skuRepo = skuRepo;
    }

    @Transactional
    public ActiveOrder createOrder(Long skuId) {
        InventorySku sku = skuRepo.findById(skuId)
            .orElseThrow(() -> new RuntimeException("SKU not found"));

        if (sku.getStockLevel() <= 0) {
            throw new RuntimeException("Out of stock");
        }

        sku.setStockLevel(sku.getStockLevel() - 1);
        skuRepo.save(sku);

        ActiveOrder order = new ActiveOrder();
        order.setInventorySku(sku);
        order.setStatus("PENDING");
        
        return orderRepo.save(order);
    }
}