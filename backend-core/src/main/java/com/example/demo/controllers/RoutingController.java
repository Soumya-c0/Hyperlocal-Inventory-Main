package com.example.demo.controllers;

import com.example.demo.services.RoutingEngineService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routing")
@CrossOrigin(origins = "*") 
public class RoutingController {
    
    private final RoutingEngineService routingEngineService;

    public RoutingController(RoutingEngineService routingEngineService) {
        this.routingEngineService = routingEngineService;
    }

    @GetMapping("/options")
    public List<Map<String, Object>> getRouteOptions(
            @RequestParam double weight,
            @RequestParam double startLat,
            @RequestParam double startLon,
            @RequestParam double endLat,
            @RequestParam double endLon) {
            
        return routingEngineService.calculateLiveRoutes(weight, startLat, startLon, endLat, endLon);
    }
}