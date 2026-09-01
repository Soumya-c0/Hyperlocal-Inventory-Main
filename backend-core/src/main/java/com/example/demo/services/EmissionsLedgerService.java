package com.example.demo.services;

import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.DoubleAdder;

@Service
public class EmissionsLedgerService {

    // Thread-safe running total — safe even if multiple couriers confirm drop-offs at the same time
    private final DoubleAdder totalEmissionsSavedGrams = new DoubleAdder();

    public void recordSavedEmissions(double gramsSaved) {
        totalEmissionsSavedGrams.add(gramsSaved);
    }

    public double getTotalEmissionsSaved() {
        return totalEmissionsSavedGrams.doubleValue();
    }

    public void reset() {
        totalEmissionsSavedGrams.reset();
    }
}