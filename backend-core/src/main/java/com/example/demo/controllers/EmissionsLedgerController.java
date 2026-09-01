package com.example.demo.controllers;

import com.example.demo.services.EmissionsLedgerService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ledger")
@CrossOrigin(origins = "*")
public class EmissionsLedgerController {

    private final EmissionsLedgerService ledgerService;

    public EmissionsLedgerController(EmissionsLedgerService ledgerService) {
        this.ledgerService = ledgerService;
    }

    @PostMapping("/record-delivery")
    public Map<String, Double> recordDelivery(@RequestBody Map<String, Double> payload) {
        double savedG = payload.getOrDefault("emissionsSavedG", 0.0);
        ledgerService.recordSavedEmissions(savedG);
        return Map.of("totalEmissionsSavedG", ledgerService.getTotalEmissionsSaved());
    }

    @GetMapping("/total-saved")
    public Map<String, Double> getTotalSaved() {
        return Map.of("totalEmissionsSavedG", ledgerService.getTotalEmissionsSaved());
    }

    @PostMapping("/reset")
    public Map<String, Double> reset() {
        ledgerService.reset();
        return Map.of("totalEmissionsSavedG", 0.0);
    }
}