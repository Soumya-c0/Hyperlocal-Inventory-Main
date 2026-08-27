package com.example.demo.controllers;

import com.example.demo.models.ActiveOrder;
import com.example.demo.services.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create/{skuId}")
    public ActiveOrder createNewOrder(@PathVariable Long skuId) {
        return orderService.createOrder(skuId);
    }
}